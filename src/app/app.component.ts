import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Pages } from './interfaces/pages';
import { AuthService } from './services/auth.service';

import { Storage } from '@ionic/storage'
import { JwtHelperService } from '@auth0/angular-jwt';

const TOKEN_KEY = 'access_token';

export interface User {
  company_id: string,
  staff_id: string
}


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  // model: User = {};
  // @Output() valueChange = new EventEmitter<User>();

  user: any;
  public appPages: Array<Pages>;
  userInfo: { company_id: string; staff_id: string; };

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public navCtrl: NavController,
    private auth: AuthService,
    private helper: JwtHelperService, 
    private storage: Storage
  ) {
    this.appPages = [
      {
        title: 'Home',
        url: '/home-results',
        direct: 'root',
        icon: 'home'
      },
      {
        title: 'About',
        url: '/about',
        direct: 'forward',
        icon: 'information-circle-outline'
      },

    ];

    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    }).catch(() => {});
  }

  goToEditProgile() {
    this.navCtrl.navigateForward('edit-profile');
  }

  logout() {
    this.auth.logout();
  }

  async ngOnInit(){
  //   await this.storage.get(TOKEN_KEY)
  //     .then((token) => {

  //       if (token) {
  //         let decoded = this.helper.decodeToken(token);
  //         this.userInfo = {company_id: '', staff_id: ''};
  //         this.userInfo.company_id = decoded.company;
  //         this.userInfo.staff_id = decoded.id;
  //         this.model = this.userInfo;
  //         this.valueChange.emit(this.model);
  //         // console.log('initial:', decoded);
  //       }

  //       this.valueChange.emit(this.model);
  //     });
  }
}
