import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeroesRoutingModule } from './heroes-routing.module';
import { HeroListComponent } from './hero-list.component';

@NgModule({
  imports: [CommonModule, HeroesRoutingModule],
  declarations: [HeroListComponent]
})
export class HeroesModule {}
