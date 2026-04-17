import { Routes } from '@angular/router';
import { redirectSignedInFromLoginGuard, requireAuthGuard } from './core/guards/auth.guards';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    canActivate: [redirectSignedInFromLoginGuard],
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: '',
    canActivateChild: [requireAuthGuard],
    children: [
      {
        path: 'admin',
        loadComponent: () => import('./pages/admin/admin.component').then((m) => m.AdminComponent)
      },
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent)
      },
      {
        path: 'characters',
        loadComponent: () => import('./pages/characters/characters.component').then((m) => m.CharactersComponent)
      },
      {
        path: 'characters/:characterId/jutsu/:jutsuId',
        loadComponent: () => import('./pages/jutsu-editor/jutsu-editor.component').then((m) => m.JutsuEditorComponent)
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
      {
        path: 'encyclopedia',
        loadComponent: () => import('./pages/encyclopedia/encyclopedia.component').then((m) => m.EncyclopediaComponent)
      },
      {
        path: 'compendium',
        loadComponent: () =>
          import('./pages/jutsu-compendium/jutsu-compendium.component').then((m) => m.JutsuCompendiumComponent)
      },
      { path: '**', redirectTo: 'home' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
