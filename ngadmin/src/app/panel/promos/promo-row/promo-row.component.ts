import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Promo } from 'src/app/models/promo';
import { API_URL } from 'src/app/config';
import { RefreshPromosService } from 'src/app/services/refresh-promos.service';
import { PromoService } from 'src/app/services/promos/promo.service';

@Component({
  selector: 'app-promo-row',
  templateUrl: './promo-row.component.html',
  styleUrls: ['./promo-row.component.less']
})
export class PromoRowComponent implements OnInit {

  @Input() promo: Promo
  @Output() editStart: EventEmitter<Promo> = new EventEmitter<Promo>()
  @Output() deleteStart: EventEmitter<Promo> = new EventEmitter<Promo>()

  apiUrl: string = API_URL

  constructor(
    private promoService: PromoService,
    private refreshPromosService: RefreshPromosService) { }

  ngOnInit() {
  }

  openEdit() {
    this.editStart.emit(this.promo)
  }

  deletePromo() {
    this.deleteStart.emit(this.promo)
  }

  changeStatus(sts: boolean) {
    this.promoService.changeStatus(this.promo.id, sts).then(r => {
      this.refreshPromosService.makeRefresh()
    })
  }

}
