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
    // Creates the edit prayer form with validators
    this.editRequestForm = this.formBuilder.group({
      title: new FormControl(this.request.Title, Validators.compose([Validators.required])),
      body: new FormControl(this.request.Body, Validators.compose([Validators.required])),
      formTags: new FormControl(''),
      frequency: new FormControl(this.request.Frequency, Validators.compose([Validators.required])),
      private: new FormControl(this.request.IsPrivate)
    });
  }

  ngAfterContentInit() {
    //this.prayerSchedules = await this.prayerServices.getPrayerScheduleList();
    //console.log(this.prayerSchedules);
    this.tagService.getAllTagsAsObservable().subscribe(tags => {
      this.tags = tags
    })
    this.prayerServices.getThisPrayersTagsAsObservable(this.request.Id).subscribe(tags => {
      this.prayerTags = tags
      tags.forEach(tag => {
        this.tagIds.push(tag.Tag_Id)
      })
    })
  }

  cancel() {
    this.editMode = false;
    this.editModeChange.emit(this.editMode)
  }

  //TODO: implement function to add custom tags
  async newTag() {
    const inputAlert = await this.alertController.create({
      header: 'Enter your custom tag:',
      inputs: [ { type: 'text', placeholder: 'type in' } ],
      buttons: [ { text: 'Cancel' }, { text: 'Ok' } ]
    })
    inputAlert.onDidDismiss().then(data => {
      let customTagName: string = data.data.values[0]
      if (customTagName) {
        // let indexFound = this.colors.findIndex(color => color === customColorName)
        // if (indexFound === -1) {
        //   this.colors.push(customColorName);
        //   this.currentColor = customColorName;
        // } else {
        //   this.currentColor = this.colors[indexFound];
        // };
      }
    })
    await inputAlert.present()

  }

  filterTags() {
    //TODO: implement search bar or something to filter tags
  }

  submit() {
    //TODO: Impliment submit functionality
    console.warn('This is what we wanna submit: ', this.editRequestForm.value)
    // this.serverError = '';
    // this.serverErrors = false;

    // // Check if there are title or body errors
    // if (!this.editRequestForm.controls.title.valid || !this.editRequestForm.controls.body.valid || !this.editRequestForm.controls.frequency.valid) {
    //   this.showErrors = true;
    //   return
    // }

    // try {

    //   // Send prayer form values to the server to insert journal
    //   let formValues = this.editRequestForm.value;

    //   console.log(formValues);
    //   let prayer = await this.prayerServices.updatePrayer(this.request.Id, formValues.title, formValues.body, formValues.private, formValues.frequency, formValues.tags);
    //   this.globalServices.sendSuccessToast(`You successfully updated your prayer request "${prayer.Title}"`)
    //   if (prayer) {
    //     this.request = prayer;
    //     this.editMode = false;
    //   }

    // } catch (error) {

    //   console.log(error);
    //   this.globalServices.sendErrorToast(`Sorry, something went wrong when attempting to update your prayer request.`);

    //   // Display the server errors
    //   this.serverErrors = true;
    //   this.serverError = error;

    //}

  }

}
