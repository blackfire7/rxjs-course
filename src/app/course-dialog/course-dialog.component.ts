import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Course} from "../model/course";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import * as moment from 'moment';
import {fromEvent} from 'rxjs';
import {exhaustMap, filter, mergeMap} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';
import {Store} from "../common/store.service";

@Component({
  selector: 'course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent implements OnInit, AfterViewInit {

  form: FormGroup;
  course: Course;

  @ViewChild('saveButton', {read: ElementRef}) saveButton: ElementRef;

  @ViewChild('searchInput') searchInput: ElementRef;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course, private store: Store) {

    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required]
    });

  }

  ngOnInit() {

    // this.form.valueChanges
    //   .pipe(
    //     filter(() => this.form.valid),
    //     mergeMap(changes => this.saveCourse(changes))
    //   )
    //   .subscribe()


  }

  saveCourse(changes: Course) {
    return fromPromise(fetch(`/api/courses/${this.course.id}`, {
      method: "PUT",
      body: JSON.stringify(changes),
      headers: {"Content-Type": "application/json"}
    }));
  }


  ngAfterViewInit() {

    // let obs$ = fromEvent(this.saveButton.nativeElement, 'click')
    //   .pipe(
    //     exhaustMap(() => this.saveCourse(this.form.value))
    //   ).subscribe();

  }


  close() {
    this.dialogRef.close();
  }

  save() {
    this.store.saveCourse(this.course.id, this.form.value).subscribe({
      next: () => this.close(),
      error: error => console.log(error)
    });
  }
}
