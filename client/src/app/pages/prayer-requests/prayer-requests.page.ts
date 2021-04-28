/**
 * prayer-requests-page.ts - 
 * This page displays all prayers for the active user, and also offers the ability to filter by specific properties. 
 * Creating a prayer on this page using the EditPrayerCardComponent will update the page to show the new prayer.
 */

import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { PrayerRequestProviderService } from '../../services/prayer-request-provider.service';
import { PrayerRequest } from '../../interfaces/prayer-request';
import { GlobalProviderService } from 'src/app/services/global-provider.service';
import { PopoverController } from '@ionic/angular';
import { EditPrayerCardComponent } from 'src/app/components/edit-prayer-card/edit-prayer-card.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-prayer-requests',
  templateUrl: './prayer-requests.page.html',
  styleUrls: ['./prayer-requests.page.scss'],
})
export class PrayerRequestsPage implements OnInit {

  //allRequests: PrayerRequest[];
  allRequests$: Observable<PrayerRequest[]> = this.prayerService.fetchUsersPrayers()
  filteredRequests: PrayerRequest[];
  searchTerm: string;

  get showSpinner() {
    return this.globalServices.showSpinner;
  }

  constructor(
    private router: Router,
    private prayerService: PrayerRequestProviderService,
    private globalServices: GlobalProviderService,
    public popoverController: PopoverController
  ) { }

  /**
   * Standard ionic function that runs everytime we go to this page
   *
   * @memberof PrayerRequestsPage
   */
  async ionViewWillEnter() {
    await this.globalServices.loadContent(this, this.getAndOrganizeData);
  }

  /**
   * Function used to setup all data for this page asynchronously **DEPRECIATED: This function is likely to help with ionic lifecycle updates, but using ngOnInit is cleaner and better practice.**
   *
   * @param {*} thisPage Acts as "this" normally would but since we call it from the global class it has to use a variable
   * @memberof PrayerRequestsPage
   */
  async getAndOrganizeData(thisPage) { // Do not use! Use ngOnInit.
    // thisPage.allRequests$.subscribe(requests => {
    //   thisPage.filteredRequests = JSON.parse(JSON.stringify(requests))
    // })
  }

  ngOnInit() {
    this.prayerService.getThisUsersPrayersAsObservable().subscribe()
    this.allRequests$.subscribe(requests => {
      this.filteredRequests = requests
    })
  }

  //Trigger prayer creation popup
  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: EditPrayerCardComponent,
      showBackdrop:true,
      cssClass: 'generic-popup',
      //event: ev,
      translucent: false
    });
    popover.onDidDismiss().then(data => {
      if (data.data != undefined) {
        this.prayerService.getThisUsersPrayersAsObservable().subscribe()
      }
    })
    return await popover.present();
  }

  goToPage(request) { //This is the required way to navigate to a prayer page since the required information is in the navigation extras.
    let navigationExtras: NavigationExtras = {
      state: {
        request: request
      }
    }
    this.router.navigate(['/prayer-request'], navigationExtras);
  }

  filterItems() { // Allow the user to filter prayers by title
    this.allRequests$.subscribe(requests => {
      this.filteredRequests = requests.filter(prayer => {
        return prayer.Title.toLowerCase().includes(this.searchTerm.toLowerCase())
      })
    })
  }

}
