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
      }
    })

  }

  public prayerstate: boolean = true;
  resolvedstate() {

  }

  ngOnInit() {      
  }

  startEdit(): void {
    this.editMode = true
  }

}
