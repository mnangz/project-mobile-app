import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';

const TOKEN_KEY = 'access_token';

@Component({
  selector: 'popmenu',
  templateUrl: './popmenu.component.html',
  styleUrls: ['./popmenu.component.scss']
})
export class PopmenuComponent implements OnInit {
  openMenu: Boolean = false;
  staff:any;

  constructor(public navCtrl: NavController, private helper: JwtHelperService, private storage: Storage,) { }

  ngOnInit() {
    this.getStaff();
  }

  async getStaff() {
    await this.storage.get(TOKEN_KEY)
      .then((token) => {

        if (token) {
          let decoded = this.helper.decodeToken(token);
          this.staff = decoded;
          console.log(this.staff);
        }

      });
  }

  togglePopupMenu() {
    return this.openMenu = !this.openMenu;
  }

  goToHome() {
    this.navCtrl.navigateRoot('/home-results');
  }

  goToManual() {
    this.navCtrl.navigateRoot('/manual-sign-in');
  }

  goToBookings() {
    this.navCtrl.navigateRoot('/sign-in-booking');
  }

  goToVisitors() {
    this.navCtrl.navigateRoot('/visitor-sign-out');
  }

  goToValid() {
    this.navCtrl.navigateRoot('/valid-questionnaire');
  }

  goToSearch() {
    this.navCtrl.navigateRoot('/search');
  }

  goToManualSearch() {
    this.navCtrl.navigateRoot('/manual-search');
  }

  goToQuestionnaires() {
    this.navCtrl.navigateRoot('/all-questionnaires');
  }


}
