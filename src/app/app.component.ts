import {Component, OnInit} from '@angular/core';
import {Store} from "./common/store.service";
import {createHttpObservable} from "./common/util";
import {delayWhen, map, retryWhen, shareReplay, tap} from "rxjs/operators";
import {timer} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private store: Store) {
  }

  ngOnInit() {
    this.store.init();
  }
}
