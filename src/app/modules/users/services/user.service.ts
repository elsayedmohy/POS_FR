import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { tap } from 'rxjs';
import { User, UserRequest } from '../../../core/models/models';
import { UserRole } from '../../../core/models/enums';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private api = inject(ApiService);
  private readonly users_end_point: string = 'users';

  // --- state ---
  private _users = signal<User[]>([]);
  private _selectedRole = signal<UserRole>(null);
  private _loading = signal(false);
  private _loaded = signal(false);
  private _error = signal<string | null>(null);

  // --- public read-only ---
  readonly users = this._users.asReadonly();
  readonly selectedRole = this._selectedRole.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // --- derived ---
  searchQuery = signal('');
  readonly filteredUsers = computed(() => {
    const users = this.users();
    const role = this.selectedRole();
    const search = this.searchQuery().toLowerCase();
    return users.filter((u) => {
      const matchesCat =
       role === null ||  role === u.role.valueOf();
      const matchesSearch = !search || u.name.toLowerCase().includes(search);
      return matchesCat && matchesSearch;
    });
  });
  readonly roleOptions = [
    { label: 'Cashier', value: UserRole.CASHIER },
    { label: 'Manager', value: UserRole.MANAGER },
  ];

  readonly roles = [
    { label: 'Admin', value: UserRole.ADMIN },
    { label: 'Cashier', value: UserRole.CASHIER },
    { label: 'Manager', value: UserRole.MANAGER },
  ];

  load() {
    if (this._loaded()) return; // already cached
    this._loading.set(true);
    this._error.set(null);

    this.api
      .get<User[]>(this.users_end_point)
      .pipe(
        tap({
          next: (data) => {
            this._users.set(data);
            this._loaded.set(true);
            this._loading.set(false);
          },
          error: (err) => {
            this._error.set(err.message ?? 'Failed to load users');
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

  updateRole(role: UserRole) {
    this._selectedRole.set(role);
  }

  add(user: UserRequest) {
    return this.api.post<User>(this.users_end_point, user).pipe(
      tap((created) => {
        this._users.update((list) => [...list, created]);
        this.refresh();
      }),
    );
  }

  update(user: UserRequest) {
    return this.api.put<User>(`${this.users_end_point}/${user.id}`, user).pipe(
      tap((updated) => {
        this._users.update((list) => list.map((u) => (u.id === updated.id ? updated : u)));
        this.refresh();
      }),
    );
  }

  delete(id: number) {
    return this.api.delete(`${this.users_end_point}/${id}`).pipe(
      tap(() => {
        this._users.update((list) => list.filter((u) => u.id !== id));
        this.refresh();
      }),
    );
  }
}
