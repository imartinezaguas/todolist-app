import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  imports:[IonicModule],
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent  implements OnInit {

  @Output() onSearch = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {}

    handleInput(event: any) {
    const value = event.detail.value.trim();
    this.onSearch.emit(value);
  }

}
