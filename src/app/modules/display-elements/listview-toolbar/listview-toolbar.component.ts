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
import { MatDialog, MatDialogRef, MatButtonToggleChange } from "@angular/material";
import { PlatformModalComponent } from "../platform-modal/platform-modal.component";
import { KeyValue } from 'src/app/models/key-value.model';
import _ from 'lodash';

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
  @Input() selectedRole: string;
  @Input() viewMode: string;
  @Input() showViewModeToggle: boolean;
  @Input() menuOptions: Array<KeyValue>;
  @Input() initSelection: Array<string>;
  @Input() multiSelect: boolean;
  @Output() search: EventEmitter<string>;
  @Output() create: EventEmitter<string>;
  @Output() loadAll: EventEmitter<void>;
  @Output() refresh: EventEmitter<string>;
  @Output() selectRole: EventEmitter<string>;
  @Output() viewModeChange: EventEmitter<string>;
  @Output() selectionChange: EventEmitter<Array<string>>;

  @ViewChild("toolbarRoot") toolbarRoot: ElementRef<HTMLDivElement>;

  focused: boolean;
  searchInput: string;
  selection: any;

  constructor(private dialog: MatDialog) {
    this.disabled = false;
    this.showCreateButton = true;
    this.showRefreshButton = true;
    this.createButtonTitle = "Create";
    this.searchPlaceholder = "Search";
    this.viewMode = "list";
    this.showViewModeToggle = false;
    this.menuOptions = new Array<KeyValue>();
    this.multiSelect = false;
    this.initSelection = new Array<string>();
    this.search = new EventEmitter<string>();
    this.create = new EventEmitter<any>();
    this.loadAll = new EventEmitter<void>();
    this.refresh = new EventEmitter<any>();
    this.selectRole = new EventEmitter<string>();
    this.viewModeChange = new EventEmitter<string>();
    this.selectionChange = new EventEmitter<Array<string>>();
    
    this.focused = false;
    this.searchInput = "";
    this.selection = {};
  }

  ngOnInit() {
    this.initSelection.forEach((sel: string) => {
      this.selection[sel] = true;
    })
  }

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

  filterList(value: string): void {
    this.selectedRole = value;
    this.selectRole.emit(value);
  }

  viewModeChanged() {
    this.viewModeChange.emit(this.viewMode);
  }

  updateSelection() {
    let statusArr = [];
    _.forEach(this.selection, (v, k) => {
      if (v) {
        statusArr.push(k);
      }
    });

    this.selectionChange.emit(statusArr);
  }
}
