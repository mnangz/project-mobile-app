import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  ModalController, 
  LoadingController} from '@ionic/angular';
import { VisitorsService } from 'src/app/services/visitors.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Storage } from '@ionic/storage';


// Modals
import { SearchFilterPage } from '../../pages/modal/search-filter/search-filter.page'
import { ImagePage } from './../modal/image/image.page';import { finalize } from 'rxjs/operators';
;

const TOKEN_KEY = 'access_token';

@Component({
  selector: 'app-visitor-sign-out',
  templateUrl: './visitor-sign-out.page.html',
  styleUrls: ['./visitor-sign-out.page.scss'],
})
export class VisitorSignOutPage implements OnInit {
  searchKey = '';
  visitors: any;
  staff:any;

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    private service: VisitorsService,
    private spinner: NgxSpinnerService,
    private helper: JwtHelperService, 
    private storage: Storage,
  ) {

  }

  async ngOnInit() {
    await this.getStaff();
    this.spinner.show();
    await this.getVisitors();
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

  getVisitors() {
    this.service.visitorsCurrentlySignedIn(this.staff).pipe(
      finalize(() => this.spinner.hide())
    ).subscribe(res => {
        this.visitors = res;
      }, err => {
        console.log(err);
      });
  }

  doRefresh(event) {
    setTimeout(() => {
      this.getVisitors();
      event.target.complete();
    }, 2000);
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

  async filterList(evt) {
    const searchTerm = evt;
  
    if (!searchTerm) {
      await this.getVisitors();
      return;
    }
  
    this.visitors = this.visitors.filter(currentVisitor => {
      if (currentVisitor.first_name && searchTerm) {
        return (currentVisitor.first_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
      if (currentVisitor.last_name && searchTerm) {
        return (currentVisitor.last_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
    });
  }

  async presentVisitor(visitor: any) {
    var myVisitor = JSON.stringify(visitor);

    const modal = await this.modalCtrl.create({
      component: ImagePage,
      componentProps: { value: myVisitor }
    });
    return await modal.present();
  }

  async signOut(id) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmation',
      message: 'Sign out the visitor?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Confirm',
          handler: async () => {

            this.service.visitorSignOut(id).subscribe();

            const loader = await this.loadingCtrl.create({
              duration: 2000
            });

            loader.present();
            loader.onWillDismiss().then(async l => {
              const toast = await this.toastCtrl.create({
                showCloseButton: true,
                message: 'Visitor signed out successfully',
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
