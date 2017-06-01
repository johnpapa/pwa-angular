import { Component } from '@angular/core';

@Component({
  selector: 'pwa-root',
  template: `
    <h1>
    {{title}}
    </h1>
    <a [routerLink]="['/home']"><span>home</span></a>
    <a [routerLink]="['/heroes']"><span>heroes</span></a>
    <a [routerLink]="['/villains']"><span>villains</span></a>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  title = 'pwa works!';
}
