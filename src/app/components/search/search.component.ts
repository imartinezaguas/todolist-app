import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ENABLE_SEARCH_BAR } from 'src/app/const/config';
import { FeatureFlagServiceService } from 'src/app/services/feature-flag-service.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  imports:[IonicModule],
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent  implements OnInit {

  @Output() onSearch = new EventEmitter<string>();
  searchBarEnabled = false;

  constructor(private featureFlag: FeatureFlagServiceService) { }

 async ngOnInit() {
    this.searchBarEnabled = await this.featureFlag.isFeatureEnabled(ENABLE_SEARCH_BAR);
  }

    handleInput(event: any) {
    const value = event.detail.value.trim();
    this.onSearch.emit(value);
  }

}
