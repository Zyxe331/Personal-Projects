/**
 * prayer-request.page.ts - 
 * This page is for displaying information specific to an individual prayer. Information is passed to this component from a route telling the component
 * what prayer to load. If the component is navigated to without route data, then a redirect will automatically happen.
 * 
 * A prayer can be edited on this page using the EditPrayerCardComponent, and should update the information dynamically using rxjs standards.
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PrayerRequest } from '../../interfaces/prayer-request';
import { PrayerSchedule } from '../../interfaces/prayer-schedule';
import { Tag } from 'src/app/interfaces/tag';
import { PrayerTag } from 'src/app/interfaces/prayer-tag';
import { PopoverController } from '@ionic/angular';
import { EditPrayerCardComponent } from 'src/app/components/edit-prayer-card/edit-prayer-card.component';
import { PrayerRequestProviderService } from 'src/app/services/prayer-request-provider.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-prayer-request',
  templateUrl: './prayer-request.page.html',
  styleUrls: ['./prayer-request.page.scss'],
})
export class PrayerRequestPage implements OnInit {

  request: PrayerRequest = new PrayerRequest();
  prayerSchedules: PrayerSchedule[];
  prayerTags: PrayerTag[];
  tagList: Tag[];
  showErrors: boolean = false;
  serverErrors: boolean = false;
  serverError: string;
  notifDate: any;
  notifTime: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public formBuilder: FormBuilder,
    private prayerServices: PrayerRequestProviderService,
    public popoverController: PopoverController,
  ) { }

  public prayerstate: boolean = true;

  //Added functionality inside of ngOnInit() that redirects the user back to the 
  //prayer-requests page when the user tries to refresh while inside of an existing prayer
  ngOnInit() {    
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.request = this.router.getCurrentNavigation().extras.state.request;
        console.log(this.router.getCurrentNavigation().extras.state)
        this.prayerServices.getThisPrayersTagsAsObservable(this.router.getCurrentNavigation().extras.state.request.Id).subscribe(tags => {
          this.prayerTags = tags
        })
      }
      else {
        this.router.navigate(['/prayer-requests'])
      }
    })
    this.setNotificationDate();
    this.setNotificationTime();
  }

  //Trigger prayer edit popup
  async startEdit(ev: any) {
    const popover = await this.popoverController.create({
      component: EditPrayerCardComponent,
      componentProps: {
        request: this.request
      },
      showBackdrop:true,
      cssClass: 'generic-popup',
      //event: ev,
      translucent: false
    });
    popover.onDidDismiss().then(data => { // Update prayer when edting finishes
      if (data.data != undefined) {
        this.request = data.data.request
        this.prayerTags = data.data.tags
      }
    })
    return await popover.present();
  }

  setNotificationDate() {
    console.log('Getting date');
    console.log(this.request.NotificationDate);
    this.notifDate = new Date(this.request.NotificationDate).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })
  }

  setNotificationTime() {
    this.notifTime = new Date(this.request.NotificationTime).toLocaleTimeString("en-US")
  }
  
}
