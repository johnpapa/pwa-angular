import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VillainsRoutingModule } from './villains-routing.module';
import { VillainListComponent } from './villain-list.component';

@NgModule({
  imports: [CommonModule, VillainsRoutingModule],
  declarations: [VillainListComponent]
})
export class VillainsModule {}
