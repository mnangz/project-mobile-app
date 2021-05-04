import { Component, OnInit } from '@angular/core';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  ModalController,
  Platform, 
  LoadingController} from '@ionic/angular';
import { BookingService } from 'src/app/services/booking.service';
import { VisitorsService } from 'src/app/services/visitors.service';
import { NgxSpinnerService } from "ngx-spinner";
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';

// Modals
import { SearchFilterPage } from '../../pages/modal/search-filter/search-filter.page';
import { ImagePage } from './../modal/image/image.page';
import { finalize } from 'rxjs/operators';

const TOKEN_KEY = 'access_token';

@Component({
  selector: 'app-sign-in-booking',
  templateUrl: './sign-in-booking.page.html',
  styleUrls: ['./sign-in-booking.page.scss'],
})
export class SignInBookingPage implements OnInit {
  searchKey = '';
  bookings: any;
  loading = false;
  staff:any;
  empty = true;

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    private service: BookingService,
    private visitorsService: VisitorsService,
    private spinner: NgxSpinnerService,
    private helper: JwtHelperService, 
    private storage: Storage,
  ) {

  }

  async ngOnInit() {
    await this.getStaff();
    this.spinner.show();
    await this.getBookings();
  }

  async getStaff() {
    await this.storage.get(TOKEN_KEY)
      .then((token) => {

        if (token) {
          let decoded = this.helper.decodeToken(token);
          this.staff = decoded;
          console.log(this.staff)
        }

      });
  }

  getBookings() {
    this.service.allBookings(this.staff).pipe(
      finalize(() => this.spinner.hide())
    ).subscribe(res => {
      this.bookings = res;
      if(this.bookings){
        this.empty = false;
      }
    }, err => {
      console.log(err);
    });
  }

  doRefresh(event) {
    setTimeout(() => {
      this.getBookings();
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
      await this.getBookings();
      return;
    }
  
    this.bookings = this.bookings.filter(currentVisitor => {
      if (currentVisitor.first_name && searchTerm) {
        return (currentVisitor.first_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
      if (currentVisitor.last_name && searchTerm) {
        return (currentVisitor.last_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
      if (currentVisitor.booking_ref_no && searchTerm) {
        return (currentVisitor.booking_ref_no.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
    });
  }

  async presentBooking(booking: any) {
    var myBooking = JSON.stringify(booking)

    const modal = await this.modalCtrl.create({
      component: ImagePage,
      componentProps: { value: myBooking }
    });
    return await modal.present();
  }


  async signIn(booking) {
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

            this.service.removeBooking(booking._id).subscribe();
            this.visitorsService.visitorSignin(booking, this.staff).subscribe();

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


