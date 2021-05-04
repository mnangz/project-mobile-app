import { Component, OnInit } from '@angular/core';
import { QuestionnaireService } from 'src/app/services/questionnaire.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';
import { allowSanitizationBypass } from '@angular/core/src/sanitization/bypass';

const TOKEN_KEY = 'access_token';

@Component({
  selector: 'app-valid-questionnaire',
  templateUrl: './valid-questionnaire.page.html',
  styleUrls: ['./valid-questionnaire.page.scss'],
})
export class ValidQuestionnairePage implements OnInit {

  questionnaire:any;
  staff:any;
  created_code: any;

  qr_data = {
    "employee_id": "",
    "location": "",
  }

  elementType: 'url' | 'img' | 'canvas' = 'canvas';

  constructor(
    public service: QuestionnaireService,
    private helper: JwtHelperService, 
    private storage: Storage,
  ) { }

  async ngOnInit() {
    await this.getStaff();
    await this.getQuestionaire();
  }

  async getStaff() {
    await this.storage.get(TOKEN_KEY)
      .then((token) => {

        if (token) {
          let decoded = this.helper.decodeToken(token);
          this.staff = decoded;
          // this.qr_data.employee_id = this.staff.username;
          // this.qr_data.location = this.staff.location;

          this.created_code = this.staff.username;
        }

      });
  }

  getQuestionaire() {
    this.service.getQuestionnaire(this.staff.username).pipe(
    ).subscribe(res => {
      this.questionnaire = res;
      console.log(this.questionnaire);
    }, err => {
      console.log(err);
    });
  }

}
