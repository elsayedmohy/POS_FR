import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    {
        path: 'auth',
        loadComponent: () => import('./layout/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', loadComponent: () => import('./modules/auth/login/login.component').then(m => m.LoginComponent) },
            { path: 'register', loadComponent: () => import('./modules/auth/register/register.component').then(m => m.RegisterComponent) },
            { path: 'forgot-password', loadComponent: () => import('./modules/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
        ]
    },
    {
        path: '',
        loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
        canActivate: [authGuard],
        children: [
            { path: 'dashboard', loadComponent: () => import('./modules/dashboard/dashboard.component').then(m => m.DashboardComponent) },
            { path: 'products', loadComponent: () => import('./modules/products/products-list/products-list.component').then(m => m.ProductsListComponent) },
            { path: 'products/new', loadComponent: () => import('./modules/products/product-form/product-form.component').then(m => m.ProductFormComponent) },
            { path: 'products/edit/:id', loadComponent: () => import('./modules/products/product-form/product-form.component').then(m => m.ProductFormComponent) },
            { path: 'categories', loadComponent: () => import('./modules/products/categories/categories.component').then(m => m.CategoriesComponent) },
            { path: 'sales', loadComponent: () => import('./modules/sales/sales-list/sales-list.component').then(m => m.SalesListComponent) },
            { path: 'sales/:id', loadComponent: () => import('./modules/sales/sale-details/sale-details.component').then(m => m.SaleDetailsComponent) },
            { path: 'pos', loadComponent: () => import('./modules/sales/pos-screen/pos-screen.component').then(m => m.PosScreenComponent) },
            { path: 'users', loadComponent: () => import('./modules/users/users-list/users-list.component').then(m => m.UsersListComponent) },
            { path: 'users/new', loadComponent: () => import('./modules/users/user-form/user-form.component').then(m => m.UserFormComponent) },
            { path: 'users/edit/:id', loadComponent: () => import('./modules/users/user-form/user-form.component').then(m => m.UserFormComponent) },
            { path: 'settings', loadComponent: () => import('./modules/settings/settings.component').then(m => m.SettingsComponent) },
        ]
    },
    { path: '**', redirectTo: '/dashboard' }
];
