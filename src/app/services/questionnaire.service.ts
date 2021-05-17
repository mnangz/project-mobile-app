import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';
import { AlertController, Platform } from '@ionic/angular';

const TOKEN_KEY = 'access_token';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json', })
};

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {

  url = environment.url;
  token:any;

  constructor(private http: HttpClient, private alertController: AlertController,) { }

  showAlert(msg) {
    let alert = this.alertController.create({
      message: msg,
      header: 'Error',
      buttons: ['OK']
    });
    alert.then(alert => alert.present());
  }

  submit(credentials) {
    return this.http.post(`${this.url}/api/questionnaire/add`, credentials)
    .pipe(
      catchError(e => {
        this.showAlert(e.error.msg)
        throw new Error(e);
      })
    );
  }

  getQuestionnaire(id){
    return this.http.get(`${this.url}/api/questionnaire/${id}`, id);
  }

  getValidQuestionnaire(id){
    return this.http.get(`${this.url}/api/questionnaire/valid/${id}`, id);
  }

  qApproved(id){
    return this.http.patch(`${this.url}/api/questionnaire/approved/${id}`, id);
  }

  form: FormGroup = new FormGroup({
    _id: new FormControl(null),
    approved: new FormControl(false),
    employee_id: new FormControl(null),
    temperature: new FormControl(null),
    location: new FormControl(''),
    fourteen_days: new FormControl(false),
    leave: new FormControl(false),
    travel: new FormControl(false),
    business: new FormControl(false),
    contact: new FormControl(false),
    tested: new FormControl(''),
    testType: new FormControl(''),
    result: new FormControl(''),
    verifiedby: new FormControl(''),
    verificationDate: new FormControl(''),
    hotBody: new FormControl(''),
    headache: new FormControl(''),
    weak: new FormControl(''),
    bodyPains: new FormControl(''),
    nausea: new FormControl(''),
    vomiting: new FormControl(''),
    soreThroat: new FormControl(''),
    cough: new FormControl(''),
    nose: new FormControl(''),
    chestPains: new FormControl(''),
    breathing: new FormControl(''),
    duration: new FormControl(''),
    __v: new FormControl(null),
  });

  initializeFormGroup() {
    this.form.setValue({
      _id: null,
      approved: false,
      employee_id: null,
      temperature: null,
      location: '',
      fourteen_days: false,
      leave: false,
      travel: false,
      business: false,
      contact: false,
      tested: '',
      testType: '',
      result: '',
      verifiedby: '',
      verificationDate: '',
      hotBody: '',
      headache: '',
      weak: '',
      bodyPains: '',
      nausea: '',
      vomiting: '',
      soreThroat: '',
      cough: '',
      nose: '',
      chestPains: '',
      breathing: '',
      duration: '',
      __v: null,
    });
  }
}
