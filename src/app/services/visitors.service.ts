import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';

const TOKEN_KEY = 'access_token';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json', })
};

@Injectable({
  providedIn: 'root'
})
export class VisitorsService {

  url = environment.url;

  public company_id:any;
  public staff_id:any;
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

  allVisitors(staff): Observable<any> {
    return this.http.get(`${this.url}/api/visitors/${staff.company}/staff/${staff.id}`, httpOptions).pipe(
      map(this.extractData),
    );
  }

  visitorSignin(credentials, staff) {
    return this.http.post(`${this.url}/api/visitor/${staff.company}/create/${staff.id}`, credentials);
  }

  getVisitor(id){
    return this.http.get(`${this.url}/api/visitor/${id}`);
  }

  visitorSignOut(id){
    return this.http.patch(`${this.url}/api/visitor/signout/${id}`, id);
  }

  visitorSeen(id){
    return this.http.patch(`${this.url}/api/visitor/seen/${id}`, id);
  }

  visitorsCurrentlySignedIn(staff): Observable<any> {
    this.delay(4000);
    return this.http.get(`${this.url}/api/visitors/currently-signed-in/${staff.company}`, httpOptions).pipe(
      map(this.extractData),
    );
  }

  visitorsCurrentlyNotSeen(): Observable<any> {
    return this.http.get(`${this.url}/api/visitors/${this.company_id}/currently-not-seen/${this.staff_id}`, httpOptions).pipe(
      map(this.extractData),
    );
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
    __v: new FormControl(null),
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
      person_visited: '',
      purpose_of_visit: '',
      __v: null,
    });
  }


}
