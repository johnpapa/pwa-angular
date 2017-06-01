import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pwa-hero-list',
  template: `
    <div class="content">
    <p>
      hero-list Works!
    </p>
    </div>
  `,
  styles: []
})
export class HeroListComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
