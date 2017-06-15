import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VillainListComponent } from './villain-list.component';

const routes: Routes = [{ path: '', component: VillainListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VillainsRoutingModule {}
