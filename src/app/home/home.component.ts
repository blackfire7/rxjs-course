import {Component, OnInit} from '@angular/core';
import {Course} from "../model/course";
import {interval, noop, Observable, of, throwError, timer} from 'rxjs';
import {catchError, delayWhen, finalize, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import {createHttpObservable} from "../common/util";


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;


    constructor() {

    }

    ngOnInit() {

      const http$ = createHttpObservable('/api/courses');

      const courses$: any = http$.pipe(
        // catchError(err => {
        //   console.log(err)
        //   return throwError(err)
        // }),
        // finalize(() => {
        //   console.log('Finished Executed');
        // }),
        tap(() => console.log('HTTP Request Completed')),
        map(res => Object.values(res['payload'])),
        shareReplay(),
        retryWhen(error => error.pipe(
          delayWhen(() => timer(2000))
        ))
      );

      this.beginnerCourses$ = courses$.pipe(
        map((courses: Course[]) => courses.filter(course => course.category == 'BEGINNER'))
      );

      this.advancedCourses$ = courses$.pipe(
        map((courses: Course[]) => courses.filter(course => course.category == 'ADVANCED'))
      );
    }

}
