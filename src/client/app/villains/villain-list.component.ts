import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'pwa-villain-list',
  template: `
    <div class="content">
      <h3>villain-list works</h3>
      <ul><li *ngFor="let v of villains">{{v.name}}</li></ul>
    </div>
  `
})
export class VillainListComponent implements OnInit {
  villains: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('/api/villains').subscribe(villains => (this.villains = villains));
  }
}
