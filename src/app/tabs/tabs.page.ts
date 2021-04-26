import { Component, NgZone, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonService } from '../services/common.service';
import { addFromData, AppConstant, removejscssfile } from '../shared/app.constant';
import { AppShared } from '../shared/app.shared';
declare var $: any;
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
  forms = [];
  htmlTamplate: any;
  urls = AppConstant.APP_PRE_JS_URLS;
  isJSFilesAdded: boolean = false;
  loading: any;
  constructor(
    private commonService: CommonService,
    private sanitizer: DomSanitizer,
    private ngZone: NgZone,
    private appShared: AppShared
  ) {

  }

  public loadScript(url) {
    console.log("preparing to load...");
    let node = document.createElement("script");
    node.src = `assets/${url}`;
    node.type = "text/javascript";
    node.async = true;
    node.charset = "utf-8";
    if (this.isJSFilesAdded && url == 'js/postForm.js') {
      return;
    }
    document.getElementsByTagName("head")[0].appendChild(node);

  }

  ngOnInit() {
    this.getFormList();
  }
  getFormList() {
    this.appShared.showLoading();
    this.commonService.getForms().subscribe((response) => {
      this.forms = response;
      this.appShared.hideLoading();
    });
    //this.forms = [{ "text": "--Select Form--", "value": "-1" }, { "text": "OPF065 ", "value": "1" }, { "text": "OPF066 ", "value": "2" }]
  }

  onSelectForm(ev: any) {
    let value = ev.detail.value;
    this.removeMoveJsFiles().then(() => {
      if (value > 0) {
        this.getFormTemplateById(value);
      } else {
        this.htmlTamplate = "";
      }
    });
  }

  getFormTemplateById(id: number) {
    // this.commonService.getFormHtml(id).subscribe((response) => {
    //   this.forms = response;
    // });
    //this.callLocalJavascripts();
    this.appShared.showLoading();
    this.commonService.getFormHtml(id).subscribe((response) => {
      this.htmlTamplate = this.sanitizer.bypassSecurityTrustHtml(response);
      this.appShared.hideLoading();
      this.ngZone.runOutsideAngular(() => {
        this.callLocalJavascripts();
      });
    });
  }
  removeMoveJsFiles() {
    return new Promise(resolve => {
      console.log("resolving promise...");
      this.urls.forEach((element, index) => {
        removejscssfile(element, "js");
        if (this.urls.length - 1 == index) {
          resolve(true);
        }
      });
    });
  }
  callLocalJavascripts() {
    new Promise(resolve => {
      console.log("resolving promise...");
      this.urls.forEach((element, index) => {
        this.loadScript(element);
        if (this.urls.length - 1 == index) {
          this.isJSFilesAdded = true;
        }
      });
    });
  }

  SaveFormFeedabck() {
    let serverRequest = addFromData();
    this.appShared.showLoading();
    this.commonService.onSaveFormData(serverRequest).subscribe((res) => {
      this.appShared.hideLoading();
      if (res) {
        const FormID = $('.formFeedbackSelector').val();
        this.appShared.showAlert('Message', `Form Updated Successfully`);
      }
    });
  }

}
