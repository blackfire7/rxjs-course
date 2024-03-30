import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Course} from "../model/course";
import {debounceTime, distinctUntilChanged, map, startWith, switchMap, tap} from 'rxjs/operators';
import {forkJoin, fromEvent, Observable} from 'rxjs';
import {Lesson} from '../model/lesson';
import {createHttpObservable} from "../common/util";
import {debug, RxJsLoggingLevel, setRxjsLoggingLevel} from "../common/debug";


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {


  course$: Observable<Course | unknown>;
  lessons$: Observable<Lesson[] | unknown>;

  courseId: string;


  @ViewChild('searchInput', {static: true, read: ElementRef}) input: ElementRef;

  constructor(private route: ActivatedRoute) {


  }

  ngOnInit() {

    this.courseId = this.route.snapshot.params['id'];
    this.course$ = createHttpObservable(`/api/courses/${this.courseId}/`);

    setRxjsLoggingLevel(RxJsLoggingLevel.TRACE);

    // FORK JOIN
    // const course$ = createHttpObservable(`/api/courses/${this.courseId}/`);
    // const lessons$ = this.loadLessons();
    //
    // forkJoin([course$, lessons$])
    //   .pipe(
    //     tap(([course, lessons]) => {
    //       console.log('course', course)
    //       console.log('lesson', lessons)
    //     })
    //   )
    //   .subscribe(console.log)

  }

  ngAfterViewInit() {

    // const searchLessons$ = fromEvent(this.input.nativeElement, 'keyup')
    //   .pipe(
    //     map((event: any) => event?.target?.value?.trim()),
    //     debounceTime(400),
    //     distinctUntilChanged(),
    //     switchMap(search => this.loadLessons(search))
    //   );
    //
    // const initialLessons$ = this.loadLessons();
    //
    // this.lessons$ = concat(initialLessons$, searchLessons$);

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

    // THROTTLING CODE
    // fromEvent(this.input.nativeElement, 'keyup')
    //   .pipe(
    //     map((event: any) => event?.target?.value?.trim()),
    //     throttleTime(500),
    //   ).subscribe(console.log);

  }

  loadLessons(search: string = ''): Observable<Lesson[] | unknown> {
    return createHttpObservable(`/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
      .pipe(
        map((res: Lesson[]) => res['payload'])
      );
  }


}
