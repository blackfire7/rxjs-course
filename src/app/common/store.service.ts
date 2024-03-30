import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {Course} from "../model/course";
import {createHttpObservable} from "./util";
import {map, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class Store {
  private subject: BehaviorSubject<Course[]> = new BehaviorSubject<Course[]>([]);

  courses$: Observable<Course[]> = this.subject.asObservable();

  init() {
    const http$ = createHttpObservable('/api/courses');

    http$.pipe(
      tap(() => console.log('HTTP Request Completed')),
      map(res => Object.values(res['payload']))
    ).subscribe({
      next: (courses: Course[]) => this.subject.next(courses)
    });
  }

  selectBeginnerCourses = () => this.filterByCategory('BEGINNER');

  selectAdvancedCourses = () => this.filterByCategory('ADVANCED');

  filterByCategory = (category: string) => this.courses$.pipe(map((courses: Course[]) => courses.filter(course => course.category == category)));

}
