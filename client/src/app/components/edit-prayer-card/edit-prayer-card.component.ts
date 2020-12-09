import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { PrayerTag } from 'src/app/interfaces/prayer-tag';
import { Tag } from 'src/app/interfaces/tag';
import { GlobalProviderService } from 'src/app/services/global-provider.service';
import { PrayerRequestProviderService } from 'src/app/services/prayer-request-provider.service';
import { TagProviderService } from 'src/app/services/tag-provider.service';
import { PrayerRequest } from '../../interfaces/prayer-request';

@Component({
  selector: 'app-edit-prayer-card',
  templateUrl: './edit-prayer-card.component.html',
  styleUrls: ['./edit-prayer-card.component.scss'],
})
export class EditPrayerCardComponent implements OnInit {
  @Input('editMode') editMode: boolean
  @Output() editModeChange: EventEmitter<boolean> = new EventEmitter()
  @Input('request') request: PrayerRequest
  @Output() requestChange = new EventEmitter()
  editRequestForm: FormGroup;
  tags: Tag[]
  prayerTags: PrayerTag[]
  tagIds: number[] = []

  showErrors: boolean = false;
  serverErrors: boolean = false;
  serverError: string;

  constructor(
    private formBuilder: FormBuilder,
    private prayerServices: PrayerRequestProviderService,
    private tagService: TagProviderService,
    private globalServices: GlobalProviderService,
    public alertController: AlertController) {
  }

  ngOnInit() {
    this.tagService.getAllTagsAsObservable().subscribe(tags => {
      this.tags = tags
    })
    if (this.request !== undefined) {
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
      this.request = {
        Id: -1,
        Title: '',
        Body: '',
        Resolved: false,
        IsPrivate: true,
        CreatedDate: newDate,
        ShortFormattedDate: this.globalServices.createShortFormattedDate(newDate),
        LongFormattedDate: this.globalServices.createLongFormattedDate(newDate),
        User_Id: -1,
        Prayer_Schedule_Id: -1,
        Frequency: ''
      }
    }

    // Creates the edit prayer form with validators
    this.editRequestForm = this.formBuilder.group({
      title: new FormControl(this.request.Title, Validators.compose([Validators.required])),
      body: new FormControl(this.request.Body, Validators.compose([Validators.required])),
      formTags: new FormControl(this.tagIds),
      frequency: new FormControl(this.request.Frequency, Validators.compose([Validators.required])),
      private: new FormControl(this.request.IsPrivate)
    });
  }

  cancel() {
    this.editMode = false;
    this.editModeChange.emit(this.editMode)
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

  submit() {
    console.warn('This is what we gonna submit: ', this.editRequestForm.value)
    let formValues = this.editRequestForm.value;
    this.serverError = '';
    this.serverErrors = false;

    // Check if there are title or body errors
    if (!this.editRequestForm.controls.title.valid || !this.editRequestForm.controls.body.valid || !this.editRequestForm.controls.frequency.valid) {
      this.showErrors = true;
      return
    }
    if (this.request.Id === -1) { // If it's a new prayer request submit a new one
      try {

        // Send journal form values to the server to insert journal
        this.prayerServices.addPrayerAsObservable(formValues.title, formValues.body, formValues.private, formValues.frequency, formValues.tags, null).subscribe(prayer => { // TODO: ADD A WAY TO INPUT SECTION ID ON THIS FORM
          this.globalServices.sendSuccessToast(`You successfully added a new prayer request "${prayer.Title}"`);
          // if (this.sectionId != undefined) {
          //   prayer = this.prayerServices.setPrayerDates(prayer);
          //   this.dismiss(prayer);
          // } else {
          //   this.router.navigate(['/prayer-requests']);
          // }
          this.editMode = false;
          this.editModeChange.emit(this.editMode)
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
        this.prayerServices.updatePrayerAsObservable(this.request.Id, formValues.title, formValues.body, formValues.private, formValues.frequency, formValues.formTags).subscribe(prayer => {
          if (prayer) {
            this.globalServices.sendSuccessToast(`You successfully updated prayer request "${prayer.Title}"`);
            this.request = prayer;
            this.editMode = false;
            this.editModeChange.emit(this.editMode)
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

}
