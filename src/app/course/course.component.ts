import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Course} from "../model/course";
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll, shareReplay, throttle, throttleTime
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat, interval} from 'rxjs';
import {Lesson} from '../model/lesson';
import {createHttpObservable} from "../common/util";


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
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search => this.loadLessons(search))
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
