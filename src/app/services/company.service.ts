import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from "@angular/forms";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  staff: any;
  url = environment.url;
  id: any;

  constructor(private http: HttpClient) {
    // this.authService.onTokenChange()
    //   .subscribe((token: NbAuthJWTToken) => {

    //     if (token.isValid()) {
    //       this.staff = token.getPayload();
    //       this.id = this.staff.company;
    //     }

    //   });
  }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  insertCompanyInfo(credentials) {
    return this.http.post(`${this.url}/api/company/`, credentials, httpOptions);
  }

  getCompany(staff): Observable<any> {
    return this.http.get(`${this.url}/api/company/${staff.company}`, httpOptions).pipe(
      map(this.extractData),
    );
  }

  changeCompanyInfo(credentials) {
    return this.http.patch(`${this.url}/api/company/edit/${this.id}`, credentials);
  }

  form: FormGroup = new FormGroup({
    _id: new FormControl(null),
    isActive: new FormControl(null),
    staff: new FormControl(null),
    visitors: new FormControl(null),
    bookings: new FormControl(null),
    company_name: new FormControl(''),
    company_email: new FormControl(''),
    company_phone_no: new FormControl(''),
    company_address: new FormControl(''),
    company_logo: new FormControl(''),
    company_color: new FormControl(''),
    __v: new FormControl(null),
  });

  initializeFormGroup() {
    this.form.setValue({
      _id: null,
      isActive: null,
      staff: null,
      visitors: null,
      bookings: null,
      company_id: '',
      company_name: '',
      compamny_email: '',
      compamny_phone_no: '',
      compamny_address: '',
      compamny_logo: '',
      company_color: '',
      __v: null,
    });
  }

  populateForm(company) {
    this.form.patchValue(company);
  }

}
