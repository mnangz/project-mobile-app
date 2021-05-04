import { Component, OnInit } from '@angular/core';
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
import { QuestionnaireService } from 'src/app/services/questionnaire.service';
import { BadgeService } from 'src/app/services/badge.service';
import { AceessLogService } from 'src/app/services/aceess-log.service';

const TOKEN_KEY = 'access_token';


@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.page.html',
  styleUrls: ['./questionnaire.page.scss'],
})
export class QuestionnairePage implements OnInit {

  staff:any;

  constructor(
    public service: QuestionnaireService,
    public bService: BadgeService,
    public aService: AceessLogService,
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private helper: JwtHelperService, 
    private storage: Storage,
  ) { }

  async ngOnInit() {
    await this.getStaff();
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

  async executeSubmission(){
    if(this.service.form.valid){
      await this.service.submit(this.service.form.value).subscribe();
      await this.bService.submit(this.service.form.value).subscribe();
      await this.aService.signIn(this.service.form.value).subscribe();
      this.service.form.reset();
      this.service.initializeFormGroup();
    }
  }

  onClear() {
    this.service.form.reset();
    this.service.initializeFormGroup();
  }

  async submit() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmation',
      message: 'Submit the questionnaire?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Confirm',
          handler: async () => {

            this.executeSubmission();

            const loader = await this.loadingCtrl.create({
              duration: 2000
            });

            loader.present();
            loader.onWillDismiss().then(async l => {

              this.home();

              const toast = await this.toastCtrl.create({
                showCloseButton: true,
                message: 'Questionnaire submited.',
                duration: 3000,
                position: 'bottom'
              });

              toast.present();
            });


            this.ngOnInit();
          }
        }
      ]
    });

    await alert.present();
  }

  home() {
    this.navCtrl.navigateRoot('/home-results');
  }

}
