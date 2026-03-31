import { computed, inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Product, ProductRequest } from '../models/product';
import { CategoryService } from './category.service';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private api = inject(ApiService);
  private categories = inject(CategoryService);
  private readonly productsURl: string = 'products';

  // --- state ---
  private _products = signal<Product[]>([]);
  private _searchQuery = signal('');
  private _loading = signal(false);
  private _loaded = signal(false);
  private _error = signal<string | null>(null);

  // --- public read-only ---
  readonly products = this._products.asReadonly();
  readonly selectedCategory = this.categories.selectedCategory;
  readonly loaded = this._loaded.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // --- derived ---
  readonly activeProducts = computed(() => this._products().filter((p) => p.active));
  readonly totalCount = computed(() => this._products().length);
  searchQuery = signal('');
  filteredProducts = computed(() => {
    const products = this.products();
    const search = this.searchQuery().toLowerCase();
    const category = this.selectedCategory();
    return products.filter((p) => {
      const matchesCat =
        category.name === 'All' || category.id === p.categoryId || p.categoryName === category.name;
      const matchesSearch = !search || p.name.toLowerCase().includes(search);
      return matchesCat && matchesSearch;
    });
  });

  constructor() {
    this.categories.load();
  }

  load() {
    if (this._loaded()) return; // already cached
    this._loading.set(true);
    this._error.set(null);

    this.api
      .get<Product[]>(this.productsURl)
      .pipe(
        tap({
          next: (data) => {
            this._products.set(data);
            this._loaded.set(true);
            this._loading.set(false);
          },
          error: (err) => {
            this._error.set(err.message ?? 'Failed to load products');
            this._loading.set(false);
          },
        }),
      )
      .subscribe();
  }

  refresh() {
    this._loaded.set(false);
    this.load();
  }

  add(product: ProductRequest) {
    return this.api.post<Product>(this.productsURl, product).pipe(
      tap((created) => {
        this._products.update((list) => [...list, created]);
        this.refresh();
      }),
    );
  }

  update(product: ProductRequest) {
    return this.api.put<Product>(`${this.productsURl}/${product.id}`, product).pipe(
      tap((updated) => {
        this._products.update((list) => list.map((p) => (p.id === updated.id ? updated : p)));
        this.refresh();
      }),
    );
  }

  delete(id: number) {
    return this.api.delete(`${this.productsURl}/${id}`).pipe(
      tap(() => {
        this._products.update((list) => list.filter((p) => p.id !== id));
        this.refresh();
      }),
    );
  }
}
