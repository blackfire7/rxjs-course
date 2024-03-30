import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Course} from "../model/course";
import {
  debounceTime,
  distinctUntilChanged,
  first,
  map,
  startWith,
  switchMap,
  take,
  tap,
  withLatestFrom
} from 'rxjs/operators';
import {forkJoin, fromEvent, Observable} from 'rxjs';
import {Lesson} from '../model/lesson';
import {createHttpObservable} from "../common/util";
import {debug, RxJsLoggingLevel, setRxjsLoggingLevel} from "../common/debug";
import {Store} from "../common/store.service";


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {


  course$: Observable<Course | unknown>;
  lessons$: Observable<Lesson[] | unknown>;

  courseId: number;


  @ViewChild('searchInput', {static: true, read: ElementRef}) input: ElementRef;

  constructor(private route: ActivatedRoute, private store: Store) {


  }

  ngOnInit() {

    this.courseId = this.route.snapshot.params['id'];
    this.course$ = this.store.selectCourseById(this.courseId);

    this.loadLessons().pipe(
      withLatestFrom(this.course$)
    ).subscribe(([lessons, course]) => {
      console.log('lessons:', lessons)
      console.log('course:', course)
    });

    setRxjsLoggingLevel(RxJsLoggingLevel.TRACE);

  }

  ngAfterViewInit() {

    // ORIGINAL SOLUTION
    this.lessons$ = fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        map((event: any) => event?.target?.value?.trim()),
        startWith(''),
        debug(RxJsLoggingLevel.TRACE, 'search'),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search => this.loadLessons(search)),
        debug(RxJsLoggingLevel.DEBUG, 'lessons value'),
      );

  }

  loadLessons(search: string = ''): Observable<Lesson[] | unknown> {
    return createHttpObservable(`/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
      .pipe(
        map((res: Lesson[]) => res['payload'])
      );
  }


}
