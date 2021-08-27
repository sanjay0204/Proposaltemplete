import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { ProposalService } from "src/app/proposal.service";
import { ToastrService } from "ngx-toastr";
import {
  GridApi,
  ICellRendererParams,
  IDatasource,
  IGetRowsParams
} from "ag-grid-community";
import { Observable } from "rxjs/Observable";

import * as moment from "moment";
import { Router } from "@angular/router";
import "rxjs/add/observable/of";
import { map } from "rxjs/operators";
import { ArchiveActionsComponent } from "../../sharedAction/archive-actions/archive-actions.component";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { SpecialCharacter } from "../../sharedservices/special-character";
@Component({
  selector: "app-archive-proposal",
  templateUrl: "./archive-proposal.component.html",
  styleUrls: ["./archive-proposal.component.css"],
  providers: [SpecialCharacter]
})
export class ArchiveProposalComponent implements OnInit {
  public startRow: number;
  public endRow: number;
  public searchObj: any = {};
  public searchForm: FormGroup;
  public ActiveProposal: any[] = [];
  public gridOptions: any;
  public searchItem = [
    { name: "Search by Proposal Id", id: "ProposalId" },
    { name: "Search by Alias", id: "CreatedByAlias" },
    { name: "Search by LastModifiedBy", id: "LastModifiedBy" },
    { name: "Search by Customer Name", id: "CustomerName" },
    { name: "Search by Deal Nick Name", id: "DealNickName" },

    { name: "Search by Created Date", id: "CreatedDate" }
  ];
  rowData: any = [];
  title = "agGridExamples";
  gridApi: GridApi;
  constructor(
    private proposalService: ProposalService,
    private router: Router,
    private customValidators: SpecialCharacter
  ) {}

  ngOnInit(): void {
    // this.loadActiveProposal();
    this.loadGrid();
    this.loadSearchForm();
  }

  setHRDEditDiv(obj) {
    console.log(obj, "obj");
  }

  private getRowData(startRow: number, endRow: number): Observable<any[]> {
    return this.proposalService.getArchivePage(startRow, endRow);
  }
  datasource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.getRowData(params.startRow, params.endRow).subscribe(data =>
        params.successCallback(data)
      );
    }
  };

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
    this.gridApi.setDatasource(this.datasource);
  }
  clearVAl() {
    this.searchForm.reset();
    this.gridApi.setDatasource(this.datasource);
  }
  reset() {
    this.searchForm.reset();
    this.gridApi.setDatasource(this.datasource);
  }
  loadSearchForm() {
    this.searchForm = new FormGroup({
      searchTextDate: new FormControl(null),
      searchField: new FormControl(null),
      searchText: new FormControl(null, [
        Validators.required,
        this.customValidators.nameValidator
      ])
    });
  }
  onSubmit(dateType) {
    var _Obj = {};
    if (this.searchForm.get("searchField").value == "CreatedByAlias") {
      let temp = this.searchForm.get("searchText").value;
      _Obj["searchText"] = "v-" + temp;
      _Obj["searchField"] = this.searchForm.get("searchField").value;
    } else if (this.searchForm.get("searchField").value == "LastModifiedBy") {
      let temp = this.searchForm.get("searchText").value;
      _Obj["searchText"] = "m-" + temp;
      _Obj["searchField"] = this.searchForm.get("searchField").value;
    } else if (
      this.searchForm.get("searchTextDate").value != "" &&
      this.searchForm.get("searchTextDate").value != null
    ) {
      let temp = this.searchForm.get("searchTextDate").value;
      temp = moment(temp).format("YYYY-MM-DD");
      // temp = moment(temp).format("MM/DD/YYYY");
      _Obj["searchText"] = temp;
      _Obj["searchField"] = this.searchForm.get("searchField").value;
    } else {
      _Obj = this.searchForm.value;
    }
    this.searchObj = _Obj;
    var datasource: IDatasource = {
      getRows: (params: IGetRowsParams) => {
        this.getRowData1(params.startRow, params.endRow).subscribe(data =>
          params.successCallback(data)
        );
      }
    };
    this.gridApi.setDatasource(datasource);
  }
  private getRowData1(startRow: number, endRow: number): Observable<any[]> {
    console.log(this.searchObj);
    this.startRow = startRow;
    this.endRow = endRow;
    let obj = {
      ...this.searchObj,
      PageSize: this.endRow,
      PageNum: this.startRow,
      isArchive:true
    };
    // var obj = {
    //   PageNum: startRow,
    //   PageSize: endRow,
    //   searchField: "CustomerName",
    //   searchText: "Te"
    // };
    return this.proposalService.getcustomeSearch(obj);
  }
  loadGrid() {
    this.gridOptions = {
      cacheBlockSize: 100,
      maxBlocksInCache: 2,
      maxConcurrentDatasourceRequests: 1,

      rowModelType: "infinite",
      pagination: true,
      paginationAutoPageSize: true
    };
  }
  columnDefs = [
    {
      headerName: "Select",
      width: 150,
      //field: "id",
      resizable: true,
      headerTooltip:"Select",
      editable:true,
      checkboxSelection: true,
      tooltipField:"id"
    },
    {
      headerName: "Proposal Id",
      width: 300,
      filter: true,
      field: "proposalId",
      tooltipField:"proposalId",
      headerTooltip:"Proposal Id",
      resizable: true
    },
    {
      headerName: "Status",
      field: "status",
      //width: 100,
      filter: true,
      tooltipField:"status",
      headerTooltip:"Status",
      resizable: true
      // cellRenderer: data => {
      //   return data.status == 0 ? "false" : "true";
      // }
    },
    
    {
      headerName: "Created By",
      //width: 100,
      filter: true,
      field: "createdByAlias",
      tooltipField:"createdByAlias",
      headerTooltip:"Created By",
      resizable: true
    },
    {
      headerName: "Created Date",
      field: "createdDate",
      resizable: true,
      filter: true,
      //width: 100,
      tooltipField:"createdDate",
      headerTooltip:"Created Date",
      cellRenderer: data => {
        return moment(data.value).format("MM/DD/YYYY");
      }
    },
    {
      headerName: "Modified By",
      //width: 100,
      filter: true,
      field: "lastModifiedBy",
      tooltipField:"lastModifiedBy",
      headerTooltip:"Modified By",
      resizable: true
    },
    {
      headerName: "Customer Name",
      //width: 100,
      filter: true,
      field: "customerName",
      tooltipField:"customerName",
      headerTooltip:"Customer Name",
      resizable: true
    },
    {
      headerName: "Deal NickName",
      //width: 100,
      filter: true,
      field: "dealNickname",
      tooltipField:"dealNickname",
      headerTooltip:"Deal NickName",
      resizable: true
    },
    {
      headerName: "Mopet Submitted",
      field: "mopetSubmittedDate",
      resizable: true,
      filter: true,
      //width: 100,
      headerTooltip:"Mopet Submitted",
      tooltipField:"mopetSubmittedDate",
      cellRenderer: (data: { value: moment.MomentInput; }) => {
        return data.value != null ? moment(data.value).format("MM/DD/YYYY") : "";
      }
    },
    {
      headerName: "Shared",
      filter: true,
      //width: 100,
      field: "isShared",
      tooltipField:"isShared",
      headerTooltip:"Shared",
      resizable: true
    },
    {
      headerName: "Delegated",
      field: "delegationStatus",
      resizable: true,
      filter: true,
      tooltipField:"delegationStatus",
      headerTooltip:"Delegated",
      //width: 100,
      cellRenderer: (data: { value: moment.MomentInput; }) =>{
        return data.value == 0 ? "false" : "true";
      }
    },
    {
      headerName: "Action",
      field: "id",
      cellRenderer: "editAction",
      resizable: true,
      //filter: true,
      // tooltipField:"id",
      // headerTooltip:"Action",
      width: 250
    }
    
  ];
  frameworkComponents = {
    editAction: ArchiveActionsComponent
  };
  onRowClicked(event) {
    console.log(event["data"]);
    this.router.navigate(["proposaloverview/", event["data"]["id"]]);
  }
}
