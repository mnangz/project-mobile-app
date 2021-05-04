import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Platform } from '@ionic/angular';

const TOKEN_KEY = 'access_token';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  url = environment.url;
  public company_id:any;
  staff_id:any;
  token:any;

  constructor(private http: HttpClient, private helper: JwtHelperService, private storage: Storage, private plt: Platform) { 
    // this.plt.ready().then(() => {
    //   this.getStaff();
    // });
  }

  // async getStaff() {
  //   await this.storage.get(TOKEN_KEY)
  //     .then((token) => {

  //       if (token) {
  //         let decoded = this.helper.decodeToken(token);
  //         this.company_id = decoded.company;
  //         this.staff_id = decoded.id;
  //       }

  //     });
  // }



  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  allBookings(staff): Observable<any> {
    return this.http.get(`${this.url}/api/bookings/${staff.company}`, httpOptions).pipe(
      map(this.extractData),
    );
  }

  makeBooking(credentials) {
    return this.http.post(`${this.url}/api/booking/${this.company_id}/create/${this.staff_id}`, credentials, httpOptions);
  }

  sendMail(credentials) {
    console.log('in send mail function');
    return this.http.post(`${this.url}/api/sendmail`, credentials);
  }

  removeBooking(id) {
    return this.http.delete(`${this.url}/api/booking/delete/${id}`, id);
  }

  getBooking(id) {
    return this.http.get(`${this.url}/api/booking/${id}`, id);
  }

  update(credentials) {
    return this.http.patch(`${this.url}/api/booking/edit`, credentials);
  }

  form: FormGroup = new FormGroup({
    _id: new FormControl(null),
    first_name: new FormControl('', Validators.required),
    last_name: new FormControl('', Validators.required),
    mobile: new FormControl('',),
    email: new FormControl('',),
    company_name: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    id_number: new FormControl('', Validators.required),
    vehicle_reg: new FormControl('',),
    purpose_of_visit: new FormControl('', Validators.required),
    person_visited: new FormControl('', Validators.required),
    notes: new FormControl('',),
    visit_date: new FormControl('', Validators.required),
    booking_ref_no: new FormControl(null),
    barcode: new FormControl(''),
    __v: new FormControl(null),
    date_booking_made: new FormControl(null),
  });

  initializeFormGroup() {
    this.form.setValue({
      _id: null,
      first_name: '',
      last_name: '',
      mobile: '',
      email: '',
      company_name: '',
      address: '',
      id_number: '',
      vehicle_reg: '',
      purpose_of_visit: '',
      person_visited: '',
      notes: '',
      visit_date: '',
      booking_ref_no: '',
      barcode: '',
      __v: null,
      date_booking_made: null,
    });
  }

  populateForm(booking) {
    this.form.setValue(booking);
  }
}
