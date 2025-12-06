import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-games',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-gray-100">
      <nav class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <h1 class="text-xl font-bold">IceBreaker</h1>
            </div>
            <div class="flex items-center">
              <button
                (click)="logout()"
                class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <h2 class="text-2xl font-semibold text-gray-900 mb-6">Welcome, {{ authService.user()?.email }}</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-lg shadow">
              <h3 class="text-lg font-medium text-gray-900 mb-2">Create a Game</h3>
              <p class="text-gray-600 mb-4">Start a new IceBreaker game session</p>
              <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Create Game
              </button>
            </div>

            <div class="bg-white p-6 rounded-lg shadow">
              <h3 class="text-lg font-medium text-gray-900 mb-2">Join a Game</h3>
              <p class="text-gray-600 mb-4">Enter a game code to join</p>
              <button class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Join Game
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
})
export class GamesComponent {
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  async logout() {
    try {
      await this.authService.signOut();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
}
