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
  concatAll, shareReplay
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat} from 'rxjs';
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


  @ViewChild('searchInput', {static: true, read: ElementRef}) input: ElementRef;

  constructor(private route: ActivatedRoute) {


  }

  ngOnInit() {

    const courseId = this.route.snapshot.params['id'];
    this.course$ = createHttpObservable(`/api/courses/${courseId}/`);

    this.lessons$ = createHttpObservable(`/api/lessons?courseId=${courseId}&pageSize=100`)
      .pipe(
        map((res: Lesson[]) => res['payload'])
      );

  }

  ngAfterViewInit() {

    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        map((event: any) => event?.target?.value?.trim()),
        debounceTime(400),
        distinctUntilChanged()
      ).subscribe(console.log);


  }


}
