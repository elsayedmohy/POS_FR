import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DataService } from '../../../core/services/data.service';
import { User } from '../../../core/models/models';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { UserRole } from '../../../core/models/enums';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    TableModule,
    ButtonModule,
    TagModule,
    InputTextModule,
    FormsModule,
    RouterLink,
    IconFieldModule,
    InputIconModule,
  ],
  template: `
    <div class="page-header">
      <h1>{{ 'USERS.TITLE' | translate }}</h1>
      <div class="flex-1"></div>
      <p-button
        icon="pi pi-user-plus"
        [label]="'USERS.ADD_USER' | translate"
        [routerLink]="['/users/new']"
        size="small"
      />
    </div>

    <div class="card">
      <div
        style="display:flex; gap:0.75rem; margin-bottom:1.25rem; flex-wrap:wrap; align-items:center;"
      >
        <p-iconfield>
          <p-inputicon class="pi pi-search" />
          <input pInputText [(ngModel)]="users.searchQuery" placeholder="Search users..." />
        </p-iconfield>
        <div style="display:flex; gap:0.5rem;">
          <p-button
            label="All"
            [outlined]="users.selectedRole() !== null"
            size="small"
            (onClick)="users.updateRole(null)"
          />
          @for (role of users.roles; track $index) {
            <p-button
              [label]="role.label"
              [outlined]="users.selectedRole() !== role.label.toUpperCase()"
              size="small"
              (onClick)="users.updateRole(role.value)"
            />
          }
        </div>
      </div>

      <p-table [value]="users.filteredUsers()" [paginator]="true" [rows]="10">
        <ng-template pTemplate="header">
          <tr>
            <th>{{ 'USERS.FULL_NAME' | translate }}</th>
            <th>{{ 'USERS.EMAIL' | translate }}</th>
            <th>{{ 'USERS.PHONE' | translate }}</th>
            <th>{{ 'USERS.ROLE' | translate }}</th>
            <th>Joined</th>
            <th>{{ 'COMMON.ACTIONS' | translate }}</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-user>
          <tr>
            <td>
              <div style="display:flex; align-items:center; gap: 0.75rem;">
                <div
                  style="width:36px;height:36px;border-radius:50%;color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;flex-shrink:0;"
                >
                  {{ user.name.charAt(0).toUpperCase() }}
                </div>
                <span style="font-weight:500;">{{ user.name }}</span>
              </div>
            </td>
            <td>{{ user.email }}</td>
            <td>{{ user.phone || '—' }}</td>
            <td>
              <p-tag
                [value]="user.role | titlecase"
                [severity]="user.role === UserRole.ADMIN ? 'warn' : 'info'"
                [rounded]="true"
              />
            </td>
            <td>{{ user.createdAt | date: 'MMM y' }}</td>
            <td>
              @if (user.role !== UserRole.ADMIN) {
                <div style="display:flex; gap:0.5rem;">
                  <p-button
                    icon="pi pi-pencil"
                    [text]="true"
                    [rounded]="true"
                    size="small"
                    [routerLink]="['/users/edit', user.id]"
                  />
                  <p-button
                    icon="pi pi-trash"
                    [text]="true"
                    [rounded]="true"
                    size="small"
                    severity="danger"
                    (onClick)="deleteUser(user)"
                  />
                </div>
              }
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="7" style="text-align:center;padding:2rem;">
              {{ 'COMMON.NO_DATA' | translate }}
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
})
export class UsersListComponent implements OnInit {
  users = inject(UserService);
  constructor(
    private data: DataService,
    private confirm: ConfirmationService,
    private msg: MessageService,
  ) {
    this.users.load();
  }

  ngOnInit() {}

  deleteUser(user: User) {
    this.confirm.confirm({
      message: `Delete user "${user.name}"?`,
      accept: () => {
        this.users.delete(user.id).subscribe(() => {
          this.msg.add({ severity: 'success', summary: 'Deleted', detail: 'User deleted' });
        });
      },
    });
  }

  protected readonly UserRole = UserRole;
}
