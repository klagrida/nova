import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 class="text-2xl font-bold mb-6 text-center">Sign In</h1>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              formControlName="email"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              [class.border-red-500]="form.controls.email.invalid && form.controls.email.touched"
            />
            @if (form.controls.email.invalid && form.controls.email.touched) {
              <p class="mt-1 text-sm text-red-600">
                @if (form.controls.email.errors?.['required']) {
                  Email is required
                }
                @if (form.controls.email.errors?.['email']) {
                  Please enter a valid email
                }
              </p>
            }
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              formControlName="password"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              [class.border-red-500]="form.controls.password.invalid && form.controls.password.touched"
            />
            @if (form.controls.password.invalid && form.controls.password.touched) {
              <p class="mt-1 text-sm text-red-600">
                Password is required
              </p>
            }
          </div>

          @if (error()) {
            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {{ error() }}
            </div>
          }

          <button
            type="submit"
            [disabled]="loading()"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            @if (loading()) {
              Signing in...
            } @else {
              Sign In
            }
          </button>

          <p class="text-center text-sm text-gray-600">
            Don't have an account?
            <a routerLink="/signup" class="text-blue-600 hover:text-blue-500">
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loading = signal(false);
  error = signal('');

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    try {
      await this.authService.signIn({
        email: this.form.value.email!,
        password: this.form.value.password!,
      });
      this.router.navigate(['/dashboard']);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      this.loading.set(false);
    }
  }
}
