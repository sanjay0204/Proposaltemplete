import { Component, OnInit } from "@angular/core";
import { ProposalService } from "src/app/proposal.service";
import { Router } from "@angular/router";
import * as moment from "moment";
import {
  GridApi,
  ICellRendererParams,
  IDatasource,
  IGetRowsParams
} from "ag-grid-community";
import { CtmwindowComponent } from "../ctm-library/ctmwindow/ctmwindow.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
@Component({
  selector: "app-ctm-library",
  templateUrl: "./ctm-library.component.html",
  styleUrls: ["./ctm-library.component.css"]
})
export class CtmLibraryComponent implements OnInit {
  constructor(private router: Router, private modalService: NgbModal) {}
  ngOnInit() {
    // this.addCTM();
  }
  addCTM(event) {
    var  file = event.target.files[0];
    console.log(file);
    const modalRef = this.modalService.open(CtmwindowComponent, {
      size: "xl"
    });
    modalRef.componentInstance.fileObj = file;
    //   this.router.navigate(["/ctmlibrary"]);
  }
}
