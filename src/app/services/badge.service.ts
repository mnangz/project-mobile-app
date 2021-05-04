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
export class BadgeService {

  url = environment.url;
  token:any;

  constructor(private http: HttpClient, private helper: JwtHelperService, private storage: Storage, private plt: Platform) { }


  submit(credentials) {
    return this.http.post(`${this.url}/api/badge/add`, credentials);
  }

  getBadge(id){
    return this.http.get(`${this.url}/api/badge/${id}`);
  }

  form: FormGroup = new FormGroup({
    _id: new FormControl(null),
    employee_id: new FormControl(''),
    location: new FormControl(''),
    __v: new FormControl(null),
  });

  initializeFormGroup() {
    this.form.setValue({
      _id: null,
      employee_id: '',
      location: '',
      __v: null,
    });
  }
}
