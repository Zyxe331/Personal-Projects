import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PrayerRequestProviderService } from '../../services/prayer-request-provider.service';
import { ContentCycleProviderService } from '../../services/content-cycle-provider.service';
import { GlobalProviderService } from '../../services/global-provider.service';
import { PrayerSchedule } from 'src/app/interfaces/prayer-schedule';
import { ModalController } from '@ionic/angular';
import { PrayerRequest } from 'src/app/interfaces/prayer-request';
import { Tag } from 'src/app/interfaces/tag';
import { TagProviderService } from 'src/app/services/tag-provider.service';

@Component({
  selector: 'app-add-prayer-request',
  templateUrl: './add-prayer-request.page.html',
  styleUrls: ['./add-prayer-request.page.scss'],
})
export class AddPrayerRequestPage implements OnInit {

  addRequestForm: FormGroup;
  showErrors: boolean = false;
  serverErrors: boolean = false;
  serverError: string;
  thisDate: string;
  prayerSchedules: PrayerSchedule[];
  sectionId: number;
  tags: Tag[];

  get showSpinner() {
    return this.globalServices.showSpinner;
  }

  constructor(
    private modalController: ModalController,
     private prayerService: PrayerRequestProviderService, 
     private contentCycleService: ContentCycleProviderService,
     private tagService: TagProviderService,
     private globalServices: GlobalProviderService, 
     public formBuilder: FormBuilder, 
     private router: Router) {

    // Creates the new prayer form with validators
    this.addRequestForm = formBuilder.group({
      title: ['', Validators.compose([Validators.required])],
      body: ['', Validators.compose([Validators.required])],
      tags: [''],
      frequency: ['', Validators.compose([Validators.required])],
      private: [false]
    });

   }

  async ngOnInit() {
    
  }

  /**
   * Standard ionic function that runs everytime we go to this page
   *
   * @memberof AddPrayerRequestPage
   */
  async ionViewWillEnter() {
    await this.globalServices.loadContent(this, this.getAndOrganizeData);  
  }

  /**
   * Function used to setup all data for this page asynchronously
   *
   * @param {*} thisPage Acts as "this" normally would but since we call it from the global class it has to use a variable
   * @memberof AddPrayerRequestPage
   */
  async getAndOrganizeData(thisPage) {
    thisPage.thisDate = thisPage.globalServices.createLongFormattedDate(new Date());
    console.log('Initializing add prayer')
    thisPage.thisDate = thisPage.globalServices.createLongFormattedDate(new Date());
    thisPage.tags = await thisPage.tagService.getAllTags();
    //this.prayerSchedules = await this.prayerService.getPrayerScheduleList();
  }

  async save() {

    // Check if there are title or body errors
    if (!this.addRequestForm.controls.title.valid || !this.addRequestForm.controls.body.valid || !this.addRequestForm.controls.frequency.valid) {
      this.showErrors = true;
      return
    }

    try {

      // Send journal form values to the server to insert journal
      let formValues = this.addRequestForm.value;
      
      let prayer = await this.prayerService.addPrayer(formValues.title, formValues.body, formValues.private, formValues.frequency, formValues.tags, this.sectionId);
      this.globalServices.sendSuccessToast(`You successfully added a new prayer request "${prayer.Title}"`);

      if (this.sectionId != undefined) {
        prayer = this.prayerService.setPrayerDates(prayer);
        this.dismiss(prayer);
      } else {
        this.router.navigate(['/prayer-requests']);
      }

    } catch (error) {

      console.log(error);
      this.globalServices.sendErrorToast(`Sorry, something went wrong when attempting to add your prayer request.`);

      // Display the server errors
      this.serverErrors = true;
      this.serverError = error;

    }

  }

  dismiss(prayer: PrayerRequest) {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
      prayer: prayer
    });
  }

}
