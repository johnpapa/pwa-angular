import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pwa-home',
  template: `
    <div class="content">
      <h3>home works!</h3>
      <pwa-sync></pwa-sync>
      <pwa-push></pwa-push>
    </div>
  `
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
