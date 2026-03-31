import { Injectable, signal, computed, inject } from '@angular/core';
import { tap } from 'rxjs';
import { Category } from '../models/category';
import { ApiService } from '../../../core/services/api.service';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private api = inject(ApiService);
  private readonly c_end_point = 'categories';

  private _categories = signal<Category[]>([]);
  private _selectedCategory = signal<Category>(null);
  private _loading = signal(false);
  private _loaded = signal(false);
  private _error = signal<string | null>(null);

  readonly categories = this._categories.asReadonly();
  readonly selectedCategory = this._selectedCategory.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly activeCategories = computed(() => this._categories().filter((c) => c.active));
  readonly filteredCategories = computed(() => this._categories());

  load() {
    if (this._loaded()) return;
    this._loading.set(true);
    this._error.set(null);

    this.api
      .get<Category[]>(`${this.c_end_point}`)
      .pipe(
        tap({
          next: (data) => {
            this._categories.set(data);
            if(data.length > 0) {
              data.unshift({id : null,name:"All"})
              this._selectedCategory.set(data[0]);
            }
            this._loaded.set(true);
            this._loading.set(false);
          },
          error: (err) => {
            this._error.set(err.message ?? 'Failed to load categories');
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

  add(category: Category) {
    return this.api
      .post<Category>(`${this.c_end_point}`, category)
      .pipe(tap((created) => this._categories.update((list) => [...list, created])));
  }

  update(category: Category) {
    return this.api
      .put<Category>(`${this.c_end_point}/${category.id}`, category)
      .pipe(
        tap((updated) =>
          this._categories.update((list) => list.map((c) => (c.id === updated.id ? updated : c))),
        ),
      );
  }

  remove(id: number) {
    return this.api
      .delete(`${this.c_end_point}/${id}`)
      .pipe(tap(() => this._categories.update((list) => list.filter((c) => c.id !== id))));
  }


  updateSelected(category: Category) {
    this._selectedCategory.set(category);
  }

}
