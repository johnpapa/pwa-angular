import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'pwa-hero-list',
  template: `
    <div class="content">
      <h3>hero-list works</h3>
    <ul><li *ngFor="let h of heroes">{{h.name}}</li></ul>
    </div>
  `,
  styles: []
})
export class HeroListComponent implements OnInit {
  heroes: any;

  constructor(private http: Http) { }

  ngOnInit() {
    this.http.get('/api/heroes.json')
      .map(response => response.json())
      .subscribe(heroes => this.heroes = heroes);
  }
}
