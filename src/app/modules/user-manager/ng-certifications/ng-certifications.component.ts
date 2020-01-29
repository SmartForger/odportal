import { Component } from '@angular/core';
import { NgUmBaseApp } from '../ng-um-base-app';
import { SimpleTableColumn, SimpleTableIconType } from 'src/app/models/simple-table-column.model';

@Component({
  selector: 'ng-certifications',
  templateUrl: './ng-certifications.component.html',
  styleUrls: ['./ng-certifications.component.scss']
})
export class NgCertificationsComponent extends NgUmBaseApp {
  columns: SimpleTableColumn[] = [
    {
      label: "Vendor",
      field: "vendor",
      iconType: SimpleTableIconType.Image
    },
    {
      label: "Certification",
      field: "certification",
      iconType: SimpleTableIconType.Image
    },
    {
      label: "Status",
      field: "status",
      iconType: SimpleTableIconType.Badge
    },
    {
      label: "",
      field: "",
      actions: [
        {
          action: "view",
          icon: "remove_red_eye",
          tooltip: "View certification"
        }
      ]
    }
  ];

  data = [
    {
      vendor: {
        icon: "https://pcte.opendash360.com/certifications-service//logos/d67b814a-dd8e-4395-8368-841938a3ac50.gif"
      },
      certification: {
        icon: "https://pcte.opendash360.com/certifications-service//logos/44f51065-4928-4745-968b-7b0f968baaaa.png",
        text: "SCYBER"
      },
      status: {
        color: "green",
        text: "Active"
      }
    },
    {
      vendor: {
        icon: "https://pcte.opendash360.com/certifications-service//logos/5b42d9a5-0bbf-40c7-aa73-09b3d4dc7663.png"
      },
      certification: {
        icon: "https://pcte.opendash360.com/certifications-service//logos/83c58963-8955-4723-8285-e1180fecf077.png",
        text: "SSCP"
      },
      status: {
        color: "red",
        text: "Expired"
      }
    },
    {
      vendor: {
        icon: "https://pcte.opendash360.com/certifications-service//logos/3b83a6ed-cb2d-43f2-90f0-b13e4ab4241d.png"
      },
      certification: {
        icon: "https://pcte.opendash360.com/certifications-service//logos/7088d4fc-be91-4e52-a8af-2b2d2bc5ed35.png",
        text: "Network+"
      },
      status: {
        color: "blue",
        text: "In Progress"
      }
    }
  ];
}
