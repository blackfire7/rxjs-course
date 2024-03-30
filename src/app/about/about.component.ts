import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {Observable} from "rxjs";

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const http$ = new Observable(observer => {
      observer.next(5);
      observer.next(6);
      observer.next(7);

      fetch('/api/courses').then(response => {
        return response.json();
      }).then(body => {
        observer.next(body);
        observer.complete();
      }).catch(error => {
        observer.error(error);
      });
    });

    http$.subscribe({
      next: courses => console.log(courses),
      error: error => console.log(error),
      complete: () => console.log('Completed'),
    });
  }

}
