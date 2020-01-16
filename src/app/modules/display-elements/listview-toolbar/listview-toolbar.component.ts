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
import { MatDialog, MatDialogRef } from "@angular/material";
import { PlatformModalComponent } from "../platform-modal/platform-modal.component";

@Component({
  selector: "app-listview-toolbar",
  templateUrl: "./listview-toolbar.component.html",
  styleUrls: ["./listview-toolbar.component.scss"]
})
export class ListviewToolbarComponent implements OnInit {
  @Input() disabled: boolean;
  @Input() showCreateButton: boolean;
  @Input() showRefreshButton: boolean;
  @Input() createButtonTitle: string;
  @Input() searchPlaceholder: string;
  @Output() search: EventEmitter<string>;
  @Output() create: EventEmitter<string>;
  @Output() loadAll: EventEmitter<void>;
  @Output() refresh: EventEmitter<string>;
  

  @ViewChild("toolbarRoot") toolbarRoot: ElementRef<HTMLDivElement>;

  focused: boolean;
  searchInput: string;

  constructor(private dialog: MatDialog) {
    this.disabled = false;
    this.showCreateButton = true;
    this.showRefreshButton = true;
    this.createButtonTitle = "Create";
    this.searchPlaceholder = "Search";
    this.search = new EventEmitter<string>();
    this.create = new EventEmitter<any>();
    this.loadAll = new EventEmitter<void>();
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

  onLoadClick(): void{
    let mdr: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {
      data: {
        title: 'Load All Users',
        submitButtonTitle: 'Accept',
        submitButtonClass: 'class',
        formFields: [{
          type: "static",
          label: "",
          defaultValue: 'The system has detected a large number of users and has disabled searching to conserve performance. If you want to enable searching, you will need to load all users in the system. This might take a long time.',
          fullWidth: true
        }]
      }
    });
    mdr.afterClosed().subscribe(data => {
      if (data) {
        this.loadAll.emit();
      }
    });
  }
}
