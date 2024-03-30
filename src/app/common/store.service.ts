import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {Course} from "../model/course";
import {createHttpObservable} from "./util";
import {map, tap} from "rxjs/operators";
import {fromPromise} from "rxjs/internal-compatibility";

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

  saveCourse(id: number, changes: Course): Observable<any> {
    const courses = this.subject.getValue();
    const courseIndex = courses.findIndex(course => course.id === id);

    const newCourses = courses.slice(0);

    newCourses[courseIndex] = {
      ...courses[courseIndex],
      ...changes
    };

    this.subject.next(newCourses);

    return fromPromise(fetch(`/api/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(changes),
      headers: {
        'content-type': 'application/json'
      }
    }));
  }

  selectCourseById = (courseId: number) => this.courses$.pipe(map((courses: Course[]) => courses.find(course => course.id == courseId)));
}
