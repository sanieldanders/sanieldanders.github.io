import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DataStoreService } from '../../core/services/data-store.service';

@Component({
  selector: 'app-profiles',
  imports: [FormsModule, RouterLink],
  templateUrl: './profiles.component.html',
  styleUrl: './profiles.component.scss'
})
export class ProfilesComponent {
  private readonly store = inject(DataStoreService);

  readonly profiles = this.store.profiles;
  readonly loading = computed(() => !this.store.isReady());

  newName = '';

  create(): void {
    const name = this.newName.trim();
    if (!name) {
      return;
    }
    this.store.addProfile(name);
    this.newName = '';
  }

  remove(id: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (confirm('Delete this profile and all saved jutsu?')) {
      this.store.deleteProfile(id);
    }
  }
}
