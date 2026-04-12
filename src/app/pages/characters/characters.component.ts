import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DataStoreService } from '../../core/services/data-store.service';

@Component({
  selector: 'app-characters',
  imports: [FormsModule, RouterLink],
  templateUrl: './characters.component.html',
  styleUrl: './characters.component.scss'
})
export class CharactersComponent {
  private readonly store = inject(DataStoreService);
  private readonly router = inject(Router);

  readonly characters = computed(() => this.store.characters());
  newName = signal('');

  create(): void {
    const name = this.newName().trim();
    if (!name) {
      return;
    }
    const c = this.store.addCharacter(name);
    this.newName.set('');
    void this.router.navigate(['/characters', c.id]);
  }

  remove(characterId: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (confirm('Delete this character?')) {
      this.store.deleteCharacter(characterId);
    }
  }
}
