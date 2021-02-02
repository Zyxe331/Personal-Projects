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

@Component({
  selector: 'app-prayer-request',
  templateUrl: './prayer-request.page.html',
  styleUrls: ['./prayer-request.page.scss'],
})
export class PrayerRequestPage implements OnInit {

  request: PrayerRequest;
  prayerSchedules: PrayerSchedule[];
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
    public popoverController: PopoverController
  ) { }

  public prayerstate: boolean = true;

  ngOnInit() {    
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.request = this.router.getCurrentNavigation().extras.state.request;
        console.log(this.router.getCurrentNavigation().extras.state)
      }
    })
    if (this.request !== undefined) {
      this.prayerServices.getThisPrayersTagsAsObservable(this.request.Id).subscribe(tags => {
        this.prayerTags = tags
      })
    } 
  }

  //Trigger prayer creation popup
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
    popover.onDidDismiss().then(data => {
      if (data.data != undefined) {
        this.request = data.data.request
      }
    })
    return await popover.present();
  }

}
