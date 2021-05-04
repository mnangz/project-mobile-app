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
import { QSurveyPage } from '../modal/q-survey/q-survey.page';

const TOKEN_KEY = 'access_token';

@Component({
  selector: 'app-qsearch',
  templateUrl: './qsearch.page.html',
  styleUrls: ['./qsearch.page.scss'],
})
export class QsearchPage implements OnInit {

  staff:any;
  companyIdForm: FormGroup;
  badge: any;
  info: any;

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

  getQuestionnaire() {

    this.empInfo = {employee_id: '', location: ''}

    this.empInfo.employee_id = this.companyIdForm.value.employee_id;
    this.empInfo.location = this.staff.location;

    console.log(this.empInfo);
    this.info = JSON.stringify(this.empInfo);
    this.presentEmployee(this.info);
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
      component: QSurveyPage,
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

}
