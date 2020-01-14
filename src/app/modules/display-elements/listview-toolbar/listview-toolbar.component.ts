import {
  Component,
  OnInit,
  Input,
  ViewChild,
  HostListener,
  ElementRef,
  Output,
  EventEmitter
} from "@angular/core";

@Component({
  selector: "app-listview-toolbar",
  templateUrl: "./listview-toolbar.component.html",
  styleUrls: ["./listview-toolbar.component.scss"]
})
export class ListviewToolbarComponent implements OnInit {
  @Input() showCreateButton: boolean;
  @Input() showRefreshButton: boolean;
  @Input() createButtonTitle: string;
  @Input() searchPlaceholder: string;
  @Output() search: EventEmitter<string>;
  @Output() create: EventEmitter<string>;
  @Output() refresh: EventEmitter<string>;

  @ViewChild("toolbarRoot") toolbarRoot: ElementRef<HTMLDivElement>;

  focused: boolean;
  searchInput: string;

  constructor() {
    this.showCreateButton = true;
    this.showRefreshButton = true;
    this.createButtonTitle = "Create";
    this.searchPlaceholder = "Search";
    this.search = new EventEmitter<string>();
    this.create = new EventEmitter<any>();
    this.refresh = new EventEmitter<any>();

    this.focused = false;
    this.searchInput = "";
  }

  ngOnInit() {}

  @HostListener("document:click", ["$event.target"])
  handleClickOutside(target) {
    if (
      !this.toolbarRoot.nativeElement ||
      !this.toolbarRoot.nativeElement.contains(target)
    ) {
      this.focused = false;
    }
  }

  clear() {
    this.searchInput = "";
    this.search.emit("");
  }
}
