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
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';

// Modals
import { SearchFilterPage } from '../../pages/modal/search-filter/search-filter.page';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { ScannedPage } from '../modal/scanned/scanned.page';
import { CompanyService } from 'src/app/services/company.service';
import { QuestionnaireService } from 'src/app/services/questionnaire.service';
import { QSurveyPage } from '../modal/q-survey/q-survey.page';

const TOKEN_KEY = 'access_token';

@Component({
  selector: 'app-home-results',
  templateUrl: './home-results.page.html',
  styleUrls: ['./home-results.page.scss']
})
export class HomeResultsPage implements OnInit {

  scannedCode = null;
  qrOptions: BarcodeScannerOptions;
  staff:any;
  company:any;
  questionnaire:any;

  constructor(
    public service: QuestionnaireService,
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private barcodeScanner: BarcodeScanner,
    private helper: JwtHelperService, 
    private storage: Storage,
    private companyService: CompanyService,
    private plt: Platform,
  ) {
    this.qrOptions = { prompt: 'Scan the QR Code provided', resultDisplayDuration: 1500, showTorchButton : true, disableSuccessBeep: false };
  }

  async ngOnInit() {
    await this.getStaff();
    await this.getQuestionaire();
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  async searchFilter () {
    const modal = await this.modalCtrl.create({
      component: SearchFilterPage
    });
    return await modal.present();
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

  getQuestionaire() {
    this.service.getQuestionnaire(this.staff.username).pipe(
    ).subscribe(res => {
      this.questionnaire = res;
    }, err => {
      console.log(err);
    });
  }


  async scanCode(){
    await this.barcodeScanner.scan(this.qrOptions)
      .then(barcodeData => {
        this.scannedCode = {employee_id: '', location: ''}

        this.scannedCode.employee_id = barcodeData.text;
        this.scannedCode.location = this.staff.location;
       })
       .catch(err => {
        console.log('Error', err);
      });
    
      this.presentVisitor(this.scannedCode);
  }

  async scanQ(){
    await this.barcodeScanner.scan(this.qrOptions)
      .then(barcodeData => {
        this.scannedCode = {employee_id: '', location: ''}

        this.scannedCode.employee_id = barcodeData.text;
        this.scannedCode.location = this.staff.location;
       })
       .catch(err => {
        console.log('Error', err);
       });
    
      this.presentQ(this.scannedCode);
  }

  async presentVisitor(staff: any) {
    var myStaff = JSON.stringify(staff);
    const modal = await this.modalCtrl.create({
      component: ScannedPage,
      componentProps: { value: myStaff }
    });

    const loader = await this.loadingCtrl.create({
      duration: 2000
    });

    loader.present();
 
    loader.onWillDismiss().then(async l => {
      return await modal.present();
    });
  }

  async presentQ(staff: any) {
    var myStaff = JSON.stringify(staff);
    const modal = await this.modalCtrl.create({
      component: QSurveyPage,
      componentProps: { value: myStaff }
    });

    const loader = await this.loadingCtrl.create({
      duration: 2000
    });

    loader.present();
 
    loader.onWillDismiss().then(async l => {
      return await modal.present();
    });
  }

  search() {
    this.navCtrl.navigateRoot('/search');
  }

  fillIn() {
    this.navCtrl.navigateRoot('/questionnaire');
  }

}
