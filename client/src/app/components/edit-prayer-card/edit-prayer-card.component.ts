import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, PopoverController } from '@ionic/angular';
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
  @Input('request') request: PrayerRequest
  @Output() requestChange = new EventEmitter()
  @Input('sectionId') sectionId: number = null
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
    public alertController: AlertController,
    private popover: PopoverController) {
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
      this.request = new PrayerRequest()
      this.request.CreatedDate = newDate
      this.request.ShortFormattedDate = this.globalServices.createShortFormattedDate(newDate)
      this.request.LongFormattedDate = this.globalServices.createLongFormattedDate(newDate)
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

  ClosePopover() {
    this.popover.dismiss({request: this.request})
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
        this.prayerServices.addPrayerAsObservable(formValues.title, formValues.body, formValues.private, formValues.frequency, formValues.formTags, this.sectionId).subscribe(prayer => {
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
        this.prayerServices.updatePrayerAsObservable(this.request.Id, formValues.title, formValues.body, formValues.private, formValues.frequency, formValues.formTags).subscribe(prayer => {
          if (prayer) {
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

}
