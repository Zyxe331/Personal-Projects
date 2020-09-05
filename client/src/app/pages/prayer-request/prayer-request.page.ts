import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PrayerRequestProviderService } from '../../services/prayer-request-provider.service';
import { PrayerRequest } from '../../interfaces/prayer-request';
import { PrayerSchedule } from '../../interfaces/prayer-schedule';
import { GlobalProviderService } from 'src/app/services/global-provider.service';
import { Tag } from 'src/app/interfaces/tag';
import { PrayerTag } from 'src/app/interfaces/prayer-tag';
import { TagProviderService } from 'src/app/services/tag-provider.service';

@Component({
  selector: 'app-prayer-request',
  templateUrl: './prayer-request.page.html',
  styleUrls: ['./prayer-request.page.scss'],
})
export class PrayerRequestPage implements OnInit {

  request: PrayerRequest;
  editRequestForm: FormGroup;
  editMode: boolean = false;
  prayerSchedules: PrayerSchedule[];
  tags: Tag[];
  tagIds: string[];
  prayerTags: PrayerTag[];
  tagList: Tag[];
  showErrors: boolean = false;
  serverErrors: boolean = false;
  serverError: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public formBuilder: FormBuilder,
    private prayerServices: PrayerRequestProviderService,
    private globalServices: GlobalProviderService,
    private tagService: TagProviderService
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.request = this.router.getCurrentNavigation().extras.state.request;
        console.log(this.router.getCurrentNavigation().extras.state)

        // Creates the edit prayer form with validators
        this.editRequestForm = formBuilder.group({
          title: [this.request.Title, Validators.compose([Validators.required])],
          body: [this.request.Body, Validators.compose([Validators.required])],
          tags: [[1]],
          frequency: [this.request.Frequency, Validators.compose([Validators.required])],
          private: [this.request.IsPrivate]
        });
      }
    })

  }

  public prayerstate: boolean = true;
  resolvedstate() {

  }

  async ngOnInit() {
    //this.prayerSchedules = await this.prayerServices.getPrayerScheduleList();
    //console.log(this.prayerSchedules);
    this.tags = await this.tagService.getAllTags();
    this.prayerTags = await this.prayerServices.getThisPrayersTags(this.request.Id);    
  }

  startEdit() {
    this.tagIds = [];
    let _this = this;
    this.prayerTags.forEach(tag => {
      _this.tagIds.push(tag.Tag_Id.toString(10));
    });

    this.editRequestForm.controls['tags'].setValue(this.tagIds);
    this.editMode = true;
  }

  cancel() {
    this.editMode = false;
  }

  async save() {

    this.serverError = '';
    this.serverErrors = false;

    // Check if there are title or body errors
    if (!this.editRequestForm.controls.title.valid || !this.editRequestForm.controls.body.valid || !this.editRequestForm.controls.frequency.valid) {
      this.showErrors = true;
      return
    }

    try {

      // Send prayer form values to the server to insert journal
      let formValues = this.editRequestForm.value;
      
      console.log(formValues);
      let prayer = await this.prayerServices.updatePrayer(this.request.Id, formValues.title, formValues.body, formValues.private, formValues.frequency, formValues.tags);
      this.globalServices.sendSuccessToast(`You successfully updated your prayer request "${prayer.Title}"`)
      if (prayer) {
        this.request = prayer;
        this.editMode = false;
      }

    } catch (error) {

      console.log(error);
      this.globalServices.sendErrorToast(`Sorry, something went wrong when attempting to update your prayer request.`);

      // Display the server errors
      this.serverErrors = true;
      this.serverError = error;

    }

  }

}
