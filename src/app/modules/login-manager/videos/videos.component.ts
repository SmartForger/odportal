import { Component, OnInit } from "@angular/core";
import { of } from "rxjs";

import { DirectQueryList } from "src/app/base-classes/direct-query-list";
import { VideoModel } from "src/app/models/video.model";
import { KeyValue } from "src/app/models/key-value.model";

import { videoList } from "./mock-data";

@Component({
  selector: "app-videos",
  templateUrl: "./videos.component.html",
  styleUrls: ["./videos.component.scss"]
})
export class VideosComponent extends DirectQueryList<VideoModel>
  implements OnInit {
  menuOptions: Array<KeyValue>;

  constructor() {
    super(
      new Array<string>(
        "name",
        "creator",
        "format",
        "length",
        "lastUpdated",
        "status",
        "actions"
      )
    );
    this.query = function(first: number, max: number) {
      return of(videoList.slice(first, max));
    }.bind(this);
    this.menuOptions = [
      {
        value: "published",
        display: "Published"
      },
      {
        value: "draft",
        display: "Draft"
      }
    ];
  }

  ngOnInit() {
    super.ngOnInit();
  }

  protected filterItems(): void {}
}
