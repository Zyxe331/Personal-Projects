import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, PopoverController, MenuController } from '@ionic/angular';
import { PrayerTag } from 'src/app/interfaces/prayer-tag';
import { Tag } from 'src/app/interfaces/tag';
import { GlobalProviderService } from 'src/app/services/global-provider.service';
import { PrayerRequestProviderService } from 'src/app/services/prayer-request-provider.service';
import { TagProviderService } from 'src/app/services/tag-provider.service';
import { PrayerRequest } from '../../interfaces/prayer-request';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Timestamp } from 'rxjs/internal/operators/timestamp';

@Component({
  selector: 'app-edit-prayer-card',
  templateUrl: './edit-prayer-card.component.html',
  styleUrls: ['./edit-prayer-card.component.scss'],
})
export class EditPrayerCardComponent implements OnInit {
  @Input('request') request: PrayerRequest
  @Output() requestChange = new EventEmitter()
  @Input('sectionId') sectionId: number = null
  editRequestForm: FormGroup;
  tags: Tag[]
  prayerTags: PrayerTag[]
  tagIds: number[] = [];
  myDate = new Date().toISOString();
  myTime = '';
  notificationToggle = false;
  minDate: any = (new Date()).getFullYear();
  maxDate: any = (new Date()).getFullYear() + 50;
  myFrequency: any = '';

  showErrors: boolean = false;
  serverErrors: boolean = false;
  serverError: string;

  constructor(
    private formBuilder: FormBuilder,
    private prayerServices: PrayerRequestProviderService,
    private tagService: TagProviderService,
    private globalServices: GlobalProviderService,
    public alertController: AlertController,
    private popover: PopoverController,
    private localNotifications: LocalNotifications,
    private menu: MenuController) {
  }

  ngOnInit() {
    this.tagService.getAllTagsAsObservable().subscribe(tags => {
      this.tags = tags
    })
    if (this.request !== undefined) {
      if (this.request.NotificationDate) {
        this.myDate = new Date(this.request.NotificationDate).toISOString()
        this.myTime = new Date(this.request.NotificationTime).toISOString()
        this.myFrequency = this.request.Frequency;
        this.changeNotificationToggle()
      }
        this.prayerServices.getThisPrayersTagsAsObservable(this.request.Id).subscribe(tags => {
        this.prayerTags = tags
        tags.forEach(tag => {
          this.tagIds.push(tag.Tag_Id)
          console.log(this.tagIds)
        })
      })
    }
    else {
      //create dummy data for creating a new prayer request
      let newDate = new Date()
      this.request = new PrayerRequest()
      this.request.CreatedDate = newDate
      this.request.ShortFormattedDate = this.globalServices.createShortFormattedDate(newDate)
      this.request.LongFormattedDate = this.globalServices.createLongFormattedDate(newDate)
      this.request.NotificationDate = this.globalServices.createShortFormattedDate(newDate)
    }

    // Creates the edit prayer form with validators
    this.editRequestForm = this.formBuilder.group({
      title: new FormControl(this.request.Title, Validators.compose([Validators.required])),
      body: new FormControl(this.request.Body, Validators.compose([Validators.required])),
      formTags: new FormControl(this.tagIds),
      NotificationDate: new FormControl(this.myDate),
      NotificationTime: new FormControl(this.myTime),
      frequency: new FormControl(this.request.Frequency),
      private: new FormControl(this.request.IsPrivate)
    });
  }

  ClosePopover() {
    this.popover.dismiss({request: this.request, tags: this.prayerTags})
  }

  cancel() {
    this.popover.dismiss()
  }

  //TODO: implement function to add custom tags
  async newTag() {
    const inputAlert = await this.alertController.create({
      header: 'Enter your custom tag:',
      inputs: [{ type: 'text', placeholder: 'type in' }],
      buttons: [{ text: 'Cancel' }, { text: 'Ok' }]
    })
    inputAlert.onDidDismiss().then(data => {
      let customTagName: string = data.data.values[0]
      if (customTagName !== "") {
        this.tagService.addTag(customTagName).subscribe(newTag => {
          this.tagIds.push(newTag.Id)
          this.tags.push(newTag)
          this.editRequestForm.patchValue({formTags: this.tagIds})
        })
      }
    })
    await inputAlert.present()

  }

  filterTags() {
    //TODO: implement search bar or something to filter tags
  }

  change(datePicker){    
    datePicker.open();
  }

  openRepeatMenu() {
    this.menu.enable(true, 'repeat');
    this.menu.open('repeat');
  }

  scheduleNotification(prayerID: any, prayerTitle: any, prayerBody: any, notificationDate: any, notificationTime: any, notificationFrequency: number) {
    let freq
    if(notificationFrequency == 1) freq = {}
    else if (notificationFrequency == 2) freq = {day:1}
    else if (notificationFrequency == 3) freq = {week:1}
    else if (notificationFrequency == 4) freq = {month:1}
    else if (notificationFrequency == 5) freq = {year:1}
    this.localNotifications.schedule({
    id: prayerID, 
     title: prayerTitle,
    text: prayerBody,
    trigger: {at: new Date(notificationTime), every: freq}
    })
    console.log('Successfully scheduled notification');
  }

  submit() {
    console.warn('This is what we gonna submit: ', this.editRequestForm.value)
    let formValues = this.editRequestForm.value;
    this.serverError = '';
    this.serverErrors = false;
    
    // Check if there are title or body errors
    if (!this.editRequestForm.controls.title.valid || !this.editRequestForm.controls.body.valid) {
      this.showErrors = true;
      return
    }
    if (this.request.Id === undefined) { // If it's a new prayer request submit a new one
      try {

        // Send journal form values to the server to insert journal
        this.prayerServices.addPrayerAsObservable(formValues.title, formValues.body, formValues.private, formValues.formTags, this.sectionId, formValues.NotificationDate, formValues.NotificationTime, formValues.frequency).subscribe(prayer => {
          if (this.notificationToggle) {
            console.log('Creating prayer notification');
            this.scheduleNotification(prayer.Id, prayer.Title, prayer.Body, formValues.NotificationDate, formValues.NotificationTime, formValues.frequency) // Add validation if notification is toggled on (date, time, freq required)
          }
          this.globalServices.sendSuccessToast(`You successfully added a new prayer request "${prayer.Title}"`);
          this.request = prayer;
          this.ClosePopover()
        })

      } catch (error) {

        console.log(error);
        this.globalServices.sendErrorToast(`Sorry, something went wrong when attempting to add your prayer request.`);

        // Display the server errors
        this.serverErrors = true;
        this.serverError = error;

      }
    }
    else { // If it's a current one update it
      try {

        // Send prayer form values to the server to insert journal
        console.log(formValues);
        this.prayerServices.updatePrayerAsObservable(this.request.Id, formValues.title, formValues.body, formValues.private, formValues.frequency, formValues.formTags, formValues.NotificationDate, formValues.NotificationTime).subscribe(prayer => {
          if (prayer) {
            if (this.notificationToggle) { // If notification is toggled on, check if notification exists. If it does, update. If not, create new notification
              if (this.localNotifications.isPresent(prayer.Id)) {
                let notification;
                notification = this.localNotifications.get(prayer.Id);
                this.localNotifications.update(notification);
              }
              else {
                this.scheduleNotification(prayer.Id, prayer.Title, prayer.Body, formValues.NotificationDate, formValues.NotificationTime, formValues.frequency) // Add validation if notification is toggled on (date, time, freq required)
              }
            }
            else { // If toggled off, check if it exists. If it does, delete it
              if (this.localNotifications.isPresent(prayer.Id)) {
                this.localNotifications.clear(prayer.Id);
              }
            }
            this.globalServices.sendSuccessToast(`You successfully updated prayer request "${prayer.Title}"`);
            this.request = prayer;
            this.ClosePopover()
          }
        })

      } catch (error) {

        console.log(error);
        this.globalServices.sendErrorToast(`Sorry, something went wrong when attempting to update your prayer request.`);

        // Display the server errors
        this.serverErrors = true;
        this.serverError = error;
      }
    }
  }

  dateChanged(date) {
    console.log(date.detail.value);
    console.log(this.myDate);
  }

  changeNotificationToggle() {
    this.notificationToggle = !this.notificationToggle;
  }

}
