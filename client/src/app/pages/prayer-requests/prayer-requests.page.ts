import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { PrayerRequestProviderService } from '../../services/prayer-request-provider.service';
import { PrayerRequest } from '../../interfaces/prayer-request';
import { GlobalProviderService } from 'src/app/services/global-provider.service';
import { PopoverController } from '@ionic/angular';
import { EditPrayerCardComponent } from 'src/app/components/edit-prayer-card/edit-prayer-card.component';

@Component({
  selector: 'app-prayer-requests',
  templateUrl: './prayer-requests.page.html',
  styleUrls: ['./prayer-requests.page.scss'],
})
export class PrayerRequestsPage implements OnInit {

  allRequests: PrayerRequest[];
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
   * Function used to setup all data for this page asynchronously
   *
   * @param {*} thisPage Acts as "this" normally would but since we call it from the global class it has to use a variable
   * @memberof PrayerRequestsPage
   */
  async getAndOrganizeData(thisPage) {
    thisPage.allRequests = await thisPage.prayerService.getThisUsersPrayers();
    thisPage.allRequests = thisPage.prayerService.setPrayersDates(thisPage.allRequests);
    thisPage.filteredRequests = JSON.parse(JSON.stringify(thisPage.allRequests));
  }

  ngOnInit() {
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
    return await popover.present();
  }

  goToPage(request) {
    let navigationExtras: NavigationExtras = {
      state: {
        request: request
      }
    }
    this.router.navigate(['/prayer-request'], navigationExtras);
  }

  filterItems() {
    let searchTerm = this.searchTerm;
    this.filteredRequests = JSON.parse(JSON.stringify(this.allRequests));
    this.filteredRequests = this.filteredRequests.filter(journal => {
      return journal.Title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

}
