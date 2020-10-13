import { Component, OnInit, ViewChild, ElementRef, ComponentRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UploadDocService } from '../services/upload-doc.service';
import { EventsService } from '../services/events.service';
import { EventIndexElement } from '../models/event-element';
import { FindEventComponent } from './find-event/find-event.component';
import { API_URL, MIME_TYPES, CAPTACHA_SECRET_KEY, CAPTACHA_WEB_KEY } from '../config';
import { OnExecuteData, ReCaptchaV3Service } from 'ng-recaptcha';
import { QuestionService } from '../services/question.service';
import { Subscription } from 'rxjs';

declare const regDesc: string;
// const regDesc: string = 'llll'

enum FormAStatus {
  start = 'START',
  sending = 'SENDING',
  sent = 'SENT'
}
@Component({
  selector: 'app-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.less']
})
export class FrontComponent implements OnInit, OnDestroy {

  formG: FormGroup;
  attachName: string = null
  events: EventIndexElement[] = []
  apiUrl: string = API_URL
  formActiveStatus: FormAStatus = FormAStatus.start
  ftype: string = 'insurance'
  mimeTypes: string = MIME_TYPES
  captchaWebKey: string = CAPTACHA_WEB_KEY
  captchaSecretKey: string = CAPTACHA_SECRET_KEY
  errorBool: boolean = false
  isAlert: boolean = false
  regDesc: string = regDesc
  @ViewChild("fileInput", { read: ElementRef, static: true }) finput: ElementRef
  @ViewChild(FindEventComponent, { static: false }) findC: FindEventComponent
  subChange: Subscription


  constructor(private fb: FormBuilder, private uploadDocService: UploadDocService, private eventsService: EventsService, private recaptchaV3Service: ReCaptchaV3Service, private questionService: QuestionService) { }


  ngOnInit() {
    this.formG = this.makeForm()
    this.subscribeToKatalogNumberSearch()
    this.subscribeValueChange()
  }



  makeForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.pattern(/^[0-9a-z_.-]+@[0-9a-z.-]+\.[a-z]{2,3}$/i)]],
      phone: ['', [Validators.required, Validators.minLength(6)]],
      number: [''],
      description: [''],
      regulation: [false, Validators.required]
    })
  }


  subscribeToKatalogNumberSearch() {
    this.formG.get('number').valueChanges.subscribe(v => {
      if (v.length > 0)
        this.searchForEvents(v)
    })
  }

  subscribeValueChange() {
    this.subChange = this.formG.valueChanges.subscribe(data => {
      this.alertsShowHide()
    })
  }

  searchForEvents(v) {
    this.eventsService.searchForEvent(v).subscribe(r => {
      if (!this.findC.isSetOn) {
        this.findC.isCloudShow = true
        this.findC.events = r
      } else {
        this.findC.isCloudShow = false
        this.findC.events = []
        this.findC.isSetOn = false
      }
    })
  }

  clickOpenAttach() {
    this.finput.nativeElement.click()
  }

  setEvNumber($event) {
    this.findC.isSetOn = true;
    this.findC.isCloudShow = false;
    this.findC.events = []
    this.formG.get('number').setValue($event._source.number)
  }

  changeReg($event) {
    this.formG.get('regulation').setValue($event)
  }

  executeSendForm() {

    this.alertsShowHide()

    if (this.checkValidData()) {
      this.isAlert = false
      this.recaptchaV3Service.execute(CAPTACHA_WEB_KEY)
        .subscribe((token) => {
          this.formActiveStatus = FormAStatus.sending
          this.sendDataToBackEnd(token)
        });
    } else {
      this.isAlert = true
    }

  }

  checkValidData(): boolean {
    var nameBool: boolean = this.formG.get('name').valid
    var emailBool: boolean = this.formG.get('email').valid
    var phoneBool: boolean = this.formG.get('phone').valid
    var regulationBool: boolean = this.formG.get('regulation').value
    return (nameBool && (emailBool || phoneBool) && regulationBool)
  }

  alertsShowHide() {
    var emailBool: boolean = this.formG.get('email').valid
    var phoneBool: boolean = this.formG.get('phone').valid
    if (!emailBool && !phoneBool) {
      this.formG.get('email').markAsTouched()
      this.formG.get('phone').markAsTouched()
    }
    if (emailBool && !phoneBool) {
      this.formG.get('phone').markAsUntouched()
    }
    if (!emailBool && phoneBool) {
      this.formG.get('email').markAsUntouched()
    }
    this.formG.get('name').markAsTouched()
  }

  sendDataToBackEnd(token: string) {
    var data = Object.assign({}, this.formG.value)
    data.token = token
    this.questionService.sendQuestionData(data).then(r => {
      this.formG.markAsUntouched()
      this.formActiveStatus = FormAStatus.sent
      this.clearForm()
    })
  }


  clearForm() {
    this.formG.get('name').setValue('')
    this.formG.get('name').markAsUntouched()
    this.formG.get('email').setValue('')
    this.formG.get('email').markAsUntouched()
    this.formG.get('phone').setValue('')
    this.formG.get('phone').markAsUntouched()
    this.formG.get('number').setValue('')
    this.formG.get('number').markAsUntouched()
    this.formG.get('description').setValue('')
    this.formG.get('description').markAsUntouched()
    this.formG.get('regulation').setValue(false)
    this.formG.markAsUntouched()
    this.findC.isCloudShow = false
    this.findC.events = []
  }

  clearStatusCloud() {
    if (this.formActiveStatus == FormAStatus.sent) {
      this.formActiveStatus = FormAStatus.start
    }
  }

  ngOnDestroy(): void {
    if (this.subChange)
      this.subChange.unsubscribe()
  }

}
