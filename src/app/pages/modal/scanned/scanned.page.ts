import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { VisitorsService } from 'src/app/services/visitors.service';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  ModalController, 
  LoadingController,
  Platform} from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';
import { finalize } from 'rxjs/operators';
import { EmployeesService } from 'src/app/services/employees.service';
import { NgxSpinnerService } from "ngx-spinner";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AceessLogService } from 'src/app/services/aceess-log.service';
import { BadgeService } from 'src/app/services/badge.service';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';

const TOKEN_KEY = 'access_token';

@Component({
  selector: 'app-scanned',
  templateUrl: './scanned.page.html',
  styleUrls: ['./scanned.page.scss'],
})
export class ScannedPage implements OnInit {

  @Input() value: any;
  public info: any;
  personInfo: any;
  staff:any;
  employee:any;
  visitorInfo = null;
  isDataAvailable:boolean = false;
  temperatureForm: FormGroup;
  badge: any;
  scannedCode = null;
  qrOptions: BarcodeScannerOptions;

  constructor(
    private sanitizer: DomSanitizer,
    public service: AceessLogService,
    public bService: BadgeService,
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    private helper: JwtHelperService, 
    private storage: Storage,
    private spinner: NgxSpinnerService,
    public employeeService: EmployeesService,
    private formBuilder: FormBuilder,
    private barcodeScanner: BarcodeScanner,
    private plt: Platform
  ) { 
    this.qrOptions = { prompt: 'Scan QR Code for consent', resultDisplayDuration: 1500, showTorchButton : true, disableSuccessBeep: false };
  }

  async ngOnInit() {
    await this.getStaff();

    this.info = this.sanitizer.bypassSecurityTrustStyle(this.value);
    this.personInfo = await JSON.parse(this.info.changingThisBreaksApplicationSecurity);
    console.log(this.personInfo);
    await this.getBadge();

    this.temperatureForm = this.formBuilder.group({
      temperature: [ null , [Validators.required ]],
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

  async getBadge(){
    await this.bService.getBadge(this.personInfo.employee_id)
    .subscribe(res => {
      this.badge = res;
      if(this.badge.length == 0){
        this.notFound();
      }
      console.log(this.badge);
    }, err => {
      console.log(err);
    });
  }

  // getEmployee(){
  //   this.employeeService.allEmployees(this.staff)
  //   .subscribe(res => {
  //     this.employee = res;
  //     console.log(this.employee)
  //   }, err => {
  //     console.log(err);
  //   });
  // }

  doRefresh(event) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 2000);
  }

  async fetchInfo() {
    this.info = this.sanitizer.bypassSecurityTrustStyle(this.value);

    const loader = await this.loadingCtrl.create({
      duration: 2000
    });

    loader.present();

    loader.onWillDismiss().then(async l => {
      this.personInfo = JSON.parse(this.info.changingThisBreaksApplicationSecurity);
    });
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  // async getConsent(){
  //   await this.barcodeScanner.scan(this.qrOptions)
  //     .then(barcodeData => {

  //       if(this.personInfo.employee_id === barcodeData.text) {
  //         this.signIn();
  //       }else{
  //         this.incorrectBadge();
  //       }
        
  //      })
  //      .catch(err => {
  //       console.log('Error', err);
  //     });
  // }

  async incorrectBadge() {
    const alert = await this.alertCtrl.create({
      header: 'Authorization failed',
      message: 'This QR-Code does not match with the badge.',
      buttons: [
         {
          text: 'Ok',
          handler: async () => {

            this.closeModal();
      
          }
        }
      ]
    });

    await alert.present();
  }

  async notFound() {
    const alert = await this.alertCtrl.create({
      header: 'Not Found',
      message: 'This badge has not been found',
      buttons: [
         {
          text: 'Ok',
          handler: async () => {

            this.closeModal();
      
          }
        }
      ]
    });

    await alert.present();
  }

  async signIn() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmation',
      message: 'Sign in?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Confirm',
          handler: async () => {

            this.executeSignIn();
      
          }
        }
      ]
    });

    await alert.present();
  }

  async executeSignIn(){
    if(this.personInfo){
        this.visitorInfo = {employee_id: '', location: '', temperature: ''}
        
        this.visitorInfo.employee_id = this.personInfo.employee_id;
        this.visitorInfo.location = this.personInfo.location;
        this.visitorInfo.temperature = this.temperatureForm.value.temperature;
        
        if(this.temperatureForm.value.temperature > 37.5) {
          this.fever();
        }

        if(this.temperatureForm.value.temperature <= 37.5 ) {
          this.service.signIn(this.visitorInfo).subscribe();

          const loader = await this.loadingCtrl.create({
            duration: 2000
          });

          loader.present();
          loader.onWillDismiss().then(async l => {
            const toast = await this.toastCtrl.create({
              showCloseButton: true,
              message: 'Person signed in successfully',
              duration: 2000,
              position: 'top'
            });
            this.closeModal();
            toast.present();
          });
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

            this.service.signIn(this.visitorInfo).subscribe();
            this.closeModal();

            const loader = await this.loadingCtrl.create({
              duration: 2000
            });

            loader.present();
            loader.onWillDismiss().then(async l => {
              const toast = await this.toastCtrl.create({
                showCloseButton: true,
                message: 'Person signed in successfully',
                duration: 2000,
                position: 'top'
              });

              toast.present();
            });
          }
        }
      ]
    });

    await alert.present();
  }


}
