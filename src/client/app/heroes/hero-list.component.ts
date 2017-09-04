import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'pwa-hero-list',
  template: `
    <div class="content">
      <h3>hero-list works</h3>
    <ul><li *ngFor="let h of heroes">{{h.name}}</li></ul>
    </div>
  `
})
export class HeroListComponent implements OnInit {
  heroes: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http
      .get<string[]>('/api/heroes')
      .subscribe(heroes => (this.heroes = heroes));
  }
}
