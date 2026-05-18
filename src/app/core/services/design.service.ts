import { Injectable, signal } from '@angular/core';

export type AppDesign = 'refined' | 'legacy';

const STORAGE_KEY = 'ndd-design';

@Injectable({ providedIn: 'root' })
export class DesignService {
  readonly design = signal<AppDesign>(readStoredDesign());

  constructor() {
    this.apply(this.design());
  }

  setDesign(design: AppDesign): void {
    this.design.set(design);
    this.apply(design);
    try {
      localStorage.setItem(STORAGE_KEY, design);
    } catch {
      /* private browsing / quota */
    }
  }

  toggle(): void {
    this.setDesign(this.design() === 'refined' ? 'legacy' : 'refined');
  }

  private apply(design: AppDesign): void {
    document.documentElement.setAttribute('data-design', design);
  }
}

function readStoredDesign(): AppDesign {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'legacy' ? 'legacy' : 'refined';
  } catch {
    return 'refined';
  }
}
