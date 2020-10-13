import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Institution } from 'src/app/models/institution';
import { InstitutionService } from 'src/app/services/institution/institution.service';
import { RefreshInstService } from 'src/app/services/refresh-inst.service';

@Component({
  selector: 'app-institution-row',
  templateUrl: './institution-row.component.html',
  styleUrls: ['./institution-row.component.less']
})
export class InstitutionRowComponent implements OnInit {

  @Input() inst: Institution
  @Output() editStart: EventEmitter<Institution> = new EventEmitter<Institution>()
  @Output() deleteStart: EventEmitter<Institution> = new EventEmitter<Institution>()

  constructor(
    private institutionService: InstitutionService,
    private refreshInstService: RefreshInstService
  ) { }

  ngOnInit() {
  }

  openEdit() {
    this.editStart.emit(this.inst)
  }

  deletePromo() {
    this.deleteStart.emit(this.inst)
  }

  changeStatus(sts: boolean) {
    this.institutionService.changeStatus(this.inst.id, sts).then(r => {
      this.refreshInstService.makeRefresh()
    })
  }

}
