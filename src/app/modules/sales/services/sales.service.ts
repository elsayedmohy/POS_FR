import { computed, inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { SaleRequest ,Sale } from '../models/sales-model';
import { Product } from '../../products/models/product';

@Injectable({ providedIn: 'root' })
export class SalesService {
  private api = inject(ApiService);
  private readonly sales_url: string = 'sales';

  // --- state ---
  private _sales = signal<Sale[]>([]);
  private _searchQuery = signal('');
  private _loading = signal(false);
  private _loaded = signal(false);
  private _error = signal<string | null>(null);

  // --- public read-only ---
  readonly sales = this._sales.asReadonly();
  readonly loaded = this._loaded.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // --- derived ---
  searchQuery = signal('');
  readonly filteredSales = computed(() => {
    const sales = this.sales();
    const search = this.searchQuery().toLowerCase();
    return sales.filter((s) => {
      return (
        !search ||
        s.createdBy.toString().toLowerCase().includes(search) ||
        s.customerName.toString().toLowerCase().includes(search)
      );
    });
  });

  load() {
    if (this._loaded()) return; // already cached
    this._loading.set(true);
    this._error.set(null);

    this.api
      .get<Sale[]>(this.sales_url)
      .pipe(
        tap({
          next: (data) => {
            this._sales.set(data);
            this._loaded.set(true);
            this._loading.set(false);
          },
          error: (err) => {
            this._error.set(err.message ?? 'Failed to load sales');
            this._loading.set(false);
          },
        }),
      )
      .subscribe();
  }

  getSaleById(id: number) {
    return this.api.get<Sale>(this.sales_url + '/' + id).pipe(
      tap({
        next: (data) => {
          return data;
        },
        error: (err) => {
          this._error.set(err.message ?? 'Failed to load sale');
        },
      }),
    );
  }

  refresh() {
    this._loaded.set(false);
    this.load();
  }

  create(sale: SaleRequest) {
    return this.api.post<Sale>(this.sales_url, sale).pipe(
      tap((created) => {
        this._sales.update((list) => [...list, created]);
        this.refresh();
      }),
    );
  }

  update(sale) {
    return this.api.put<Sale>(`${this.sales_url}/${sale.id}`, sale).pipe(
      tap((updated) => {
        this._sales.update((list) => list.map((p) => (p.id === updated.id ? updated : p)));
        this.refresh();
      }),
    );
  }

  delete(id: number) {
    return this.api.delete(`${this.sales_url}/${id}`).pipe(
      tap(() => {
        this._sales.update((list) => list.filter((p) => p.id !== id));
        this.refresh();
      }),
    );
  }
}
