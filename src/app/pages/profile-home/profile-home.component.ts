import { TitleCasePipe } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs/operators';
import type { JutsuClassification } from '../../core/models/app-data.model';
import { DataStoreService } from '../../core/services/data-store.service';

@Component({
  selector: 'app-profile-home',
  imports: [RouterLink, FormsModule, TitleCasePipe],
  templateUrl: './profile-home.component.html',
  styleUrl: './profile-home.component.scss'
})
export class ProfileHomeComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly store = inject(DataStoreService);

  readonly profileId = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('profileId') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('profileId') ?? '' }
  );

  readonly profile = computed(() => {
    const id = this.profileId();
    return id ? this.store.getProfile(id) : undefined;
  });

  editName = '';

  constructor() {
    effect(() => {
      const p = this.profile();
      this.editName = p?.name ?? '';
    });
  }

  saveProfileName(): void {
    const id = this.profileId();
    const name = this.editName.trim();
    if (!id || !name) {
      return;
    }
    this.store.updateProfile(id, { name });
  }

  startNew(kind: JutsuClassification): void {
    const id = this.profileId();
    const p = this.profile();
    if (!id || !p) {
      return;
    }
    const draft = this.store.newDraft(id, kind);
    void this.router.navigate(['/profiles', id, 'jutsu', draft.id], {
      queryParams: { edit: '1' }
    });
  }

  removeJutsu(jutsuId: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const id = this.profileId();
    if (!id) {
      return;
    }
    if (confirm('Delete this jutsu?')) {
      this.store.deleteJutsu(id, jutsuId);
    }
  }
}
