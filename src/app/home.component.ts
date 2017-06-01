import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pwa-home',
  template: `
    <div class="content">
    <p>
      home Works!
    </p>
    </div>
  `,
  styles: []
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
