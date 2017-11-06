import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'pwa-villain-list',
  template: `
    <div class="content">
      <h3>villain-list works</h3>
      <ul><li *ngFor="let v of villains">{{v.name}}</li></ul>
    </div>
  `,
  styles: []
})
export class VillainListComponent implements OnInit {
  villains: any;

  constructor(private http: Http) { }

  ngOnInit() {
    this.http.get('/api/villains.json')
      .map(response => response.json())
      .subscribe(villains => this.villains = villains);
  }
}
