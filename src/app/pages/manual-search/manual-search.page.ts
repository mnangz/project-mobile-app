import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-manual-search',
  templateUrl: './manual-search.page.html',
  styleUrls: ['./manual-search.page.scss'],
})
export class ManualSearchPage implements OnInit {

  constructor(public navCtrl: NavController) { }

  ngOnInit() {
  }

  badgeSearch() {
    this.navCtrl.navigateRoot('/search');
  }

  qSearch() {
    this.navCtrl.navigateRoot('/qsearch');
  }

}
