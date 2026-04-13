import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NPC_ENCYCLOPEDIA_BUILTIN } from '../../core/content/npc-encyclopedia.builtin';

@Component({
  selector: 'app-encyclopedia',
  imports: [RouterLink],
  templateUrl: './encyclopedia.component.html',
  styleUrl: './encyclopedia.component.scss'
})
export class EncyclopediaComponent {
  readonly entries = NPC_ENCYCLOPEDIA_BUILTIN;
}
