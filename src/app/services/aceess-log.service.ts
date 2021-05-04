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
export class AceessLogService {

  url = environment.url;
  token: any;

  constructor(private http: HttpClient, private helper: JwtHelperService, private storage: Storage, private plt: Platform) { }


  signIn(credentials) {
    return this.http.post(`${this.url}/api/accesslog/add`, credentials);
  }

  form: FormGroup = new FormGroup({
    _id: new FormControl(null),
    employee_id: new FormControl(''),
    location: new FormControl(''),
    temperature: new FormControl(null),
    __v: new FormControl(null),
  });

  initializeFormGroup() {
    this.form.setValue({
      _id: null,
      employee_id: '',
      location: '',
      temperature: null,
      __v: null,
    });
  }
}
