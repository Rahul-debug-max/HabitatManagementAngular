import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstant } from '../shared/app.constant';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient) { }

  getForms(): Observable<any> {
    let apiName = 'form/GetForms';
    return this.http.get(AppConstant.API_URL + apiName);
  }

  getFormHtml(id): Observable<any> {
    let apiName = `form/GetFormHtml/${id}/false`;
    return this.http.get(AppConstant.API_URL + apiName, {
      responseType: 'text'
    });
  }

  getHtmlData(): Observable<any> {
    let apiName = `../assets/template.html`;
    return this.http.get(apiName, {
      headers: new HttpHeaders({
        'Accept': 'text/html',
        'Content-Type': 'application/json'
      }),
      responseType: 'text'
    });
  }

  onSaveFormData(resfromData: any): Observable<any> {
    let apiName = `form/SaveFormData`;
    const formData = new FormData();
    formData.append('data', JSON.stringify(resfromData));
    return this.http.post(AppConstant.API_URL + apiName, formData);
  }

  //https://dynamicformapi.rsk-bsl.co.uk/api/api/form/SaveFormData



}
