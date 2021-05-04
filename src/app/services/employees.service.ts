import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';

const TOKEN_KEY = 'access_token';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

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

  allEmployees(staff): Observable<any> {
    return this.http.get(`${this.url}/api/staff/${staff.company}`, httpOptions).pipe(
      map(this.extractData),
    );
  }

}
