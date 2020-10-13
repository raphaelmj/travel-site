import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Recommendation } from 'src/app/models/recommendation';
import { RecommendationService } from 'src/app/services/recommendations/recommendation.service';
import { RefreshRecommendationsService } from 'src/app/services/refresh-recommendations.service';
import { API_URL } from 'src/app/config';

@Component({
  selector: 'app-recommendation-row',
  templateUrl: './recommendation-row.component.html',
  styleUrls: ['./recommendation-row.component.less']
})
export class RecommendationRowComponent implements OnInit {

  @Input() reco: Recommendation
  @Output() editStart: EventEmitter<Recommendation> = new EventEmitter<Recommendation>()
  @Output() deleteStart: EventEmitter<Recommendation> = new EventEmitter<Recommendation>()

  apiUrl: string = API_URL

  constructor(
    private recoService: RecommendationService,
    private refreshRecommendationsService: RefreshRecommendationsService
  ) { }

  ngOnInit() {
  }

  openEdit() {
    this.editStart.emit(this.reco)
  }

  deletePromo() {
    this.deleteStart.emit(this.reco)
  }

  changeStatus(sts: boolean) {
    this.recoService.changeStatus(this.reco.id, sts).then(r => {
      this.refreshRecommendationsService.makeRefresh()
    })
  }

}
