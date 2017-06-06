import { Component } from '@angular/core';

@Component({
  selector: 'pwa-root',
  template: `
    <md-toolbar color="primary" class="dark">
      <div class="md-toolbar-tools" fxLayout="row nowrap" fxFlex fxLayoutAlign="end center">
        <a class="ng-title-icon" href="http://angular.io" target="_blank" rel="noopener" aria-label="angular icon"><i></i></a>
        <!--<span fxFlex class="title">One with Angular</span>-->
        <span fxFlex="grow"></span>
        <a fxFlex md-button [routerLink]="['/home']"
          routerLinkActive="router-link-active"><span>home</span></a>
        <a fxFlex md-button [routerLink]="['/heroes']"
          routerLinkActive="router-link-active"><span>heroes</span></a>
        <a fxFlex md-button [routerLink]="['/villains']"
          routerLinkActive="router-link-active"><span>villains</span></a>
        <a fxFlex class="pull-right" md-button href="http://johnpapa.net" target="_blank" rel="noopener"><span>John Papa</span></a>
      </div>
    </md-toolbar>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  title = 'pwa works!';
}
