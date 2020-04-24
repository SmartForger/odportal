/**
 * @description Lists active vendor apps in a table. Shows which apps are enabled.
 * @author Steven M. Redman
 */

import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import _ from 'lodash';
import { Observable, Subscription } from 'rxjs';

import { App } from '../../../models/app.model';
import { ApiSearchCriteria } from '../../../models/api-search-criteria.model';
import { DirectQueryList } from 'src/app/base-classes/direct-query-list';
import { ApiSearchResult } from 'src/app/models/api-search-result.model';
import { AppsService } from '../../../services/apps.service';
import { Vendor } from 'src/app/models/vendor.model';
import { TableSelectionService } from '../../../services/table-selection.service';

@Component({
	selector: 'app-list-all-apps',
	templateUrl: './list-all-apps.component.html',
	styleUrls: [ './list-all-apps.component.scss' ]
})
export class ListAllAppsComponent extends DirectQueryList<App> implements OnInit {
	searchCriteria: ApiSearchCriteria;
	selectedItems: Object;
	selectedCount: number;
	selectionSub: Subscription;

	@Input() vendor: Vendor;
	@Output() upload: EventEmitter<any>;

	status: any;
	viewMode: string;
	vendorMap: Object;

	readonly menuOptions = [
		{
			display: 'Active',
			value: 'active'
		},
		{
			display: 'Disabled',
			value: 'disabled'
		},
		{
			display: 'Pending',
			value: 'pending'
		}
	];

	constructor(private appsSvc: AppsService, protected selectionSvc: TableSelectionService) {
		super(
			new Array<string>(
				'selection',
				'appTitle',
				'version',
				'widgets',
				'clientName',
				'vendor',
				'status',
				'actions'
			)
		);
		this.status = {
			active: false,
			disabled: false,
			pending: false
		};
		this.vendor = {
			name: '',
			pocEmail: '',
			pocPhone: ''
		};
		this.upload = new EventEmitter();
		this.searchCriteria = new ApiSearchCriteria({ name: '' }, 0, 'name', 'asc');
		this.query = function(first: number, max: number) {
			return new Observable<Array<App>>((observer) => {
				this.appsSvc.listVendorApps1(this.vendor.docId, this.searchCriteria).subscribe(
					(results: ApiSearchResult<App>) => {
						observer.next(results.data);
						observer.complete();
					},
					(err: any) => {
						observer.error(err);
						observer.complete();
					}
				);
			});
		}.bind(this);
		this.selectedItems = {};
		this.selectedCount = 0;
		this.selectionSvc.setCompareField('docId');
		this.selectionSvc.resetSelection();
	}

	ngOnInit() {
		super.ngOnInit();
		this.vendorMap = {
			[this.vendor.docId]: this.vendor.name
		};
		this.selectionSub = this.selectionSvc.selection.subscribe((selected) => {
			this.selectedItems = selected;
			this.selectedCount = this.selectionSvc.getSelectedCount();
		});
	}

	ngOnDestroy() {
		this.selectionSub.unsubscribe();
	}

	get totalApps() {
		let str = this.paginator.length + ' Total Microapp';
		return this.paginator.length > 1 ? str + 's' : str;
	}

	updateStatus(statusArr: string[]) {
		this.searchCriteria.filters.status = statusArr.join(',');
		this.refresh();
	}

	viewModeChange(mode: string): void {
		this.viewMode = mode;
	}

	isAllSelected() {
		let result = true;
		this.displayItems.forEach((item) => {
			result = this.selectedItems[item.docId] && result;
		});
		return result;
	}

	toggleAllSelection() {
		const selected = this.isAllSelected();
		this.selectionSvc.selectBatch(this.displayItems, !selected);
	}

	protected filterItems(): void {
		if (this.allItemsFetched) {
			if (this.sortColumn === '') {
				this.sortColumn = 'appTitle';
			}
			this.filteredItems.sort((a: App, b: App) => {
				const sortOrder = this.sort.direction === 'desc' ? -1 : 1;
				return a[this.sortColumn] < b[this.sortColumn] ? -1 * sortOrder : sortOrder;
			});
			this.listDisplayItems();
		}
	}
}
