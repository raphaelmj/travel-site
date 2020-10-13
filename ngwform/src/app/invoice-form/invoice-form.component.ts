import { Component, OnInit, ViewChild, ElementRef, ComponentRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UploadDocService } from '../services/upload-doc.service';
import { EventsService } from '../services/events.service';
import { EventIndexElement } from '../models/event-element';
import { FindEventComponent } from '../find-event/find-event.component';
import { API_URL, MIME_TYPES, CAPTACHA_SECRET_KEY, CAPTACHA_WEB_KEY } from '../config';
import { OnExecuteData, ReCaptchaV3Service } from 'ng-recaptcha';
import { Subscription } from 'rxjs';

// const regDesc: string = 'lorem'
declare const regDesc: string;

enum FormAStatus {
  start = 'START',
  sending = 'SENDING',
  sent = 'SENT'
}

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.less']
})
export class InvoiceFormComponent implements OnInit, OnDestroy {

  formG: FormGroup;
  attachName: string = null
  events: EventIndexElement[] = []
  apiUrl: string = API_URL
  formActiveStatus: FormAStatus = FormAStatus.start
  ftype: string = 'invoice'
  regDesc: string = regDesc
  mimeTypes: string = MIME_TYPES
  hasDoc: boolean = true;
  errorBool: boolean = false
  isAlert: boolean = false
  @ViewChild("fileInput", { read: ElementRef, static: true }) finput: ElementRef
  @ViewChild(FindEventComponent, { static: false }) findC: FindEventComponent
  maxFileSize: number = 1000000
  toLargeFile: boolean = false
  subChange: Subscription


  constructor(private fb: FormBuilder, private uploadDocService: UploadDocService, private eventsService: EventsService, private recaptchaV3Service: ReCaptchaV3Service) { }

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
      doc: [''],
      regulation: [false, Validators.required]
    })
  }


  subscribeToKatalogNumberSearch() {
    this.formG.get('number').valueChanges.subscribe(v => {
      // console.log(v)
      if (v.length > 0)
        this.searchForEvents(v)
    })
  }

  subscribeValueChange() {
    this.subChange = this.formG.valueChanges.subscribe(data => {
      this.alertsShowHide()
    })
  }

  changeReg($event) {
    this.formG.get('regulation').setValue($event)
  }

  searchForEvents(v) {
    this.eventsService.searchForEvent(v).subscribe(r => {
      // console.log(r)
      // if(this.findC.isCloudShow)
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

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.toLargeFile = file.size > this.maxFileSize
      this.attachName = event.target.files[0].name
      this.formG.get('doc').setValue(file);
      this.hasDoc = true
    }
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

  sendForm() {

    this.alertsShowHide()
    // this.hasDoc = Boolean(this.formG.get('doc').value)

    // if (this.formG.valid && Boolean(this.formG.get('doc').value) && !this.toLargeFile) {
    if (this.checkValidData() && !this.toLargeFile) {
      this.isAlert = false
      this.recaptchaV3Service.execute(CAPTACHA_WEB_KEY)
        .subscribe((token) => {
          var formData = this.prepareDataToSend(token)
          this.formActiveStatus = FormAStatus.sending
          this.executeSending(formData)
        });

    } else {
      this.isAlert = true
    }
  }

  prepareDataToSend(token: string): FormData {
    const formData = new FormData();
    formData.append('token', token);
    formData.append('doc', this.formG.get('doc').value);
    formData.append('name', this.formG.get('name').value)
    formData.append('email', this.formG.get('email').value)
    formData.append('phone', this.formG.get('phone').value)
    formData.append('number', this.formG.get('number').value)
    formData.append('description', this.formG.get('description').value)
    return formData
  }

  executeSending(formData: FormData) {
    this.uploadDocService.upload(formData, this.ftype).subscribe(
      (res) => {
        // console.log(res)
        this.formActiveStatus = FormAStatus.sent
        this.clearForm()
      },
      (err) => {
        // console.log(err)
      }
    );
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
    this.formG.get('doc').setValue('')
    this.formG.get('doc').markAsUntouched()
    this.formG.markAsUntouched()
    this.formG.get('regulation').setValue(false)
    this.attachName = null
    this.findC.isCloudShow = false
    this.findC.events = []
    this.hasDoc = true
    this.toLargeFile = false
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
