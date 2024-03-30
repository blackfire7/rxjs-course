import {Component, OnInit} from '@angular/core';
import {AsyncSubject, BehaviorSubject, concat, interval, merge, of, ReplaySubject, Subject} from "rxjs";
import {map} from "rxjs/operators";
import {createHttpObservable} from "../common/util";

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
