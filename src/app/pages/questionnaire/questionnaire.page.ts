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
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';

const TOKEN_KEY = 'access_token';


@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.page.html',
  styleUrls: ['./questionnaire.page.scss'],
})
export class QuestionnairePage implements OnInit {

  staff:any;
  scannedCode = null;
  qrOptions: BarcodeScannerOptions;
  questionnaire: any;
  companyId: any;

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
    private barcodeScanner: BarcodeScanner,
    private storage: Storage,
  ) { 
    this.qrOptions = { prompt: 'Scan QR Code for consent', resultDisplayDuration: 1500, showTorchButton : true, disableSuccessBeep: false };
  }

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

  async scanId(){
    await this.barcodeScanner.scan(this.qrOptions)
    .then(barcodeData => {
      this.companyId = barcodeData.text;
     })
     .catch(err => {
      console.log('Error', err);
    });
  }


  onClear() {
    this.service.form.reset();
    this.service.initializeFormGroup();
  }
  
  checkForQuestionnaire(){
    if(this.service.form.valid){
      this.service.getValidQuestionnaire(this.service.form.value.employee_id)
       .subscribe(res => {
      this.questionnaire = res;
        if(this.questionnaire.length > 0){
          this.exists();
        }else{
          this.submit();
        }
      }, err => {
        console.log(err);
      });
    }
  }

  async exists() {
    const alert = await this.alertCtrl.create({
      header: 'Already Exists',
      message: 'A valid questionnaire with this company ID already exists',
      buttons: ['Ok']
    });

    await alert.present();
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
          }
        }
      ]
    });

    await alert.present();
  }

  async executeSubmission(){
    if(this.service.form.valid){
      if(this.staff.isNurse){
        await this.scanCode();
        if(this.service.form.valid){
          if(this.service.form.value.employee_id === this.scannedCode) {
            this.consentSuccesful();
          }else{
            this.incorrectBadge();
          }
        }
      }

      if(this.staff.isEmployee){
        this.service.submit(this.service.form.value).subscribe();

        const loader = await this.loadingCtrl.create({
          duration: 2000
        });

        loader.present();
        loader.onWillDismiss().then(async l => {

          this.home();

          const toast = await this.toastCtrl.create({
            showCloseButton: true,
            message: 'Questionnaire has been successfully submitted',
            duration: 2000,
            position: 'bottom'
          });

          toast.present();
        });


        this.ngOnInit();
      }
      
      this.service.form.reset();
      this.service.initializeFormGroup();
    }
  }

  async scanCode(){
    await this.barcodeScanner.scan(this.qrOptions)
    .then(barcodeData => {
      this.scannedCode = barcodeData.text;
     })
     .catch(err => {
      console.log('Error', err);
    });
  }

  async incorrectBadge() {
    const alert = await this.alertCtrl.create({
      header: 'Consent failed',
      message: 'This QR-Code does not match with the questionnaire and submission was not successful.',
      buttons: [
        {
         text: 'Ok',
         handler: async () => {

           this.ngOnInit();
     
         }
       }
     ]
    });

    await alert.present();
  }

  async consentSuccesful(){
    if(this.service.form.valid){

      if(this.service.form.value.temperature > 37.5) {
        this.fever();
      }

      if(this.service.form.value.temperature <= 37.5 ) {
        this.saveAll();
      }
    }
  }

  async fever() {
    const alert = await this.alertCtrl.create({
      header: 'High temperature',
      message: 'This person has a fever, are you sure you want to sign in?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Confirm',
          handler: async () => {
            if(this.service.form.valid){
              this.saveAll();
              console.log('started');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async saveAll(){
    if(this.service.form.valid){
      this.service.submit(this.service.form.value).subscribe();
      this.bService.submit(this.service.form.value).subscribe();
      this.aService.signIn(this.service.form.value).subscribe();
  
      const loader = await this.loadingCtrl.create({
        duration: 2000
      });
  
      loader.present();
      loader.onWillDismiss().then(async l => {
        this.goToQuestionnaires();
  
        const toast = await this.toastCtrl.create({
          showCloseButton: true,
          message: 'Submission successful and person has been signed in.',
          duration: 2000,
          position: 'bottom'
        });
  
        toast.present();
      });
    } 
  }

  home() {
    this.navCtrl.navigateRoot('/home-results');
  }

  goToQuestionnaires() {
    this.navCtrl.navigateRoot('/all-questionnaires');
  }

}
