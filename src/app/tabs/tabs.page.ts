import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IonContent } from '@ionic/angular';
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
  @ViewChild(IonContent, { static: false }) content: IonContent;
  forms = [];
  projects = [];
  htmlTamplate: any;
  urls = AppConstant.APP_PRE_JS_URLS;
  isJSFilesAdded: boolean = false;
  loading: any;
  productID: any;
  formInputValue: any;
  productOptions: any = {
    cssClass: 'product-alert-css'
  };
  formOptions: any = {
    cssClass: 'form-alert-css'
  };

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
    this.getProjectList();
  }
  getProjectList() {
    this.appShared.showLoading();
    this.commonService.getProjects().subscribe((response) => {
      this.projects = response;
      this.productOptions = {
        cssClass: 'product-alert-css'
      };
      this.appShared.hideLoading();
    }, (error) => {
      this.onError(error);
    });
  }
  getFormList(projectId: any) {
    this.appShared.showLoading();
    this.forms = [];
    this.forms = [{ "text": "--Select Form--", "value": "-1" }];
    this.commonService.getForms(projectId).subscribe((response) => {
      response.forEach(element => {
        this.forms.push(element);
      });
      this.formInputValue = this.forms[0].value;
      this.appShared.hideLoading();
    }, (error) => {
      this.onError(error);
    });
  }


  onSelectProject(ev: any) {
    let value = ev.detail.value;
    if (!!value) {
      this.productID = value;
      this.getFormList(value);
    }
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
    this.appShared.showLoading();
    this.commonService.getFormHtml(id).subscribe((response) => {
      this.htmlTamplate = this.sanitizer.bypassSecurityTrustHtml(response);
      console.log(this.htmlTamplate);
      this.appShared.hideLoading();
      this.ngZone.runOutsideAngular(() => {
        this.callLocalJavascripts();
      });
    }, (error) => {
      this.onError(error);
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
    if (serverRequest == false) {
      this.appShared.alertCtrl.create({
        header: 'Error',
        subHeader: 'Fill the form.',
        buttons: ['OK']
      }).then((alert) => {
        alert.present();
        alert.onDidDismiss().then(() => {
          this.ScrollToTop();
        });
      });
    } else {
      this.appShared.showLoading();
      this.commonService.onSaveFormData(serverRequest, this.productID).subscribe((res) => {
        this.appShared.hideLoading();
        if (res) {
          this.formInputValue = this.forms[0].value;
          this.htmlTamplate = "";
          this.appShared.showAlert('Message', `Form Updated Successfully`);
        }
      }, (error) => {
        this.onError(error);
      });
    }

  }

  onError(err: any) {
    this.appShared.showAlert('Error', err.message);
    this.appShared.hideLoading();
  }

  ScrollToTop() {
    this.content.scrollToTop(1500);
  }

}
