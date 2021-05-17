import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  ModalController, 
  LoadingController,
  Platform} from '@ionic/angular';

import { ScannedPage } from '../modal/scanned/scanned.page';

import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BadgeService } from 'src/app/services/badge.service';

const TOKEN_KEY = 'access_token';


@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  staff:any;
  companyIdForm: FormGroup;
  info: any;
  isBadgeAvailable = false;
  badges: any;

  empInfo = null;

  constructor(
    public service: BadgeService,
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private helper: JwtHelperService, 
    private storage: Storage,
    private formBuilder: FormBuilder,
  ) { }

  async ngOnInit() {
    this.getStaff();

    this.companyIdForm = this.formBuilder.group({
      employee_id: ['', [Validators.required ]]
    });
  }

  async getStaff() {
    await this.storage.get(TOKEN_KEY)
      .then((token) => {

        if (token) {
          let decoded = this.helper.decodeToken(token);
          this.staff = decoded;
        }

      });
  }

  getBadge() {

    this.empInfo = {employee_id: '', location: ''}

    this.empInfo.employee_id = this.companyIdForm.value.employee_id;
    this.empInfo.location = this.staff.location;

    this.info = JSON.stringify(this.empInfo);
    this.presentEmployee(this.info);
  }

  // async noBadge() {
  //   const alert = await this.alertCtrl.create({
  //     header: 'Badge not found?',
  //     message: 'This persons badge has not been found in the system',
  //     buttons: ['Ok', 'Cancel']
  //   });

  //   await alert.present();
  // }

  async presentEmployee(info) {
    var myId = info;

    const modal = await this.modalCtrl.create({
      component: ScannedPage,
      componentProps: { value: myId }
    });

    const loader = await this.loadingCtrl.create({
      duration: 2000
    });

    loader.present();

    loader.onWillDismiss().then(async l => {
      return await modal.present();
    });
  }

  async initializeBadges(){
    await this.service.getAllBadges()
    .subscribe(res => {
      this.badges = res;
    }, err => {
      console.log(err);
    });
  }

  getBadges(ev: any) {
    // Reset badges back to all of the badges
    this.initializeBadges();

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the badges
    if (val && val.trim() !== '') {
        this.isBadgeAvailable = true;
        this.badges = this.badges.filter((badge) => {
            return (badge.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
    } else {
        this.isBadgeAvailable = false;
    }
  }


}
