import { Component, OnInit } from '@angular/core';
import { VisitorsService } from 'src/app/services/visitors.service';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  ModalController, 
  LoadingController} from '@ionic/angular';
import { EmployeesService } from 'src/app/services/employees.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Storage } from '@ionic/storage';
import { JwtHelperService } from '@auth0/angular-jwt';
import { finalize } from 'rxjs/operators';

const TOKEN_KEY = 'access_token';

@Component({
  selector: 'app-manual-sign-in',
  templateUrl: './manual-sign-in.page.html',
  styleUrls: ['./manual-sign-in.page.scss'],
})
export class ManualSignInPage implements OnInit {

  visitorInfo = null;
  employee:any;
  staff:any;

  constructor(
    public service: VisitorsService,
    public employeeService: EmployeesService,
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    private spinner: NgxSpinnerService,
    private helper: JwtHelperService, 
    private storage: Storage,
  ) { }

  async ngOnInit() {
    await this.getStaff();
    this.spinner.show();
    await this.getEmployee();
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

  async getEmployee(){
    await this.employeeService.allEmployees(this.staff).pipe(
      finalize(() => this.spinner.hide())
    ).subscribe(res => {
      this.employee = res;
    }, err => {
      console.log(err);
    });
  }

  executeSignIn(){
    if(this.service.form.valid){
      this.service.visitorSignin(this.service.form.value, this.staff).subscribe();
      this.service.form.reset();
      this.service.initializeFormGroup();
    }
  }

  onClear() {
    this.service.form.reset();
    this.service.initializeFormGroup();
  }

  async signIn() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmation',
      message: 'Sign in the visitor?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Confirm',
          handler: async () => {

            this.executeSignIn();

            const loader = await this.loadingCtrl.create({
              duration: 2000
            });

            loader.present();
            loader.onWillDismiss().then(async l => {
              const toast = await this.toastCtrl.create({
                showCloseButton: true,
                message: 'Visitor signed in successfully',
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

}
