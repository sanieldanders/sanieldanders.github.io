import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent)
  },
  {
    path: 'characters',
    loadComponent: () => import('./pages/characters/characters.component').then((m) => m.CharactersComponent)
  },
  {
    path: 'characters/:characterId',
    loadComponent: () =>
      import('./pages/character-sheet/character-sheet.component').then((m) => m.CharacterSheetComponent)
  },
  {
    path: 'profiles',
    loadComponent: () => import('./pages/profiles/profiles.component').then((m) => m.ProfilesComponent)
  },
  {
    path: 'profiles/:profileId',
    loadComponent: () => import('./pages/profile-home/profile-home.component').then((m) => m.ProfileHomeComponent)
  },
  {
    path: 'profiles/:profileId/jutsu/:jutsuId',
    loadComponent: () => import('./pages/jutsu-editor/jutsu-editor.component').then((m) => m.JutsuEditorComponent)
  },
  { path: '**', redirectTo: 'home' }
];
