/**
 * section.page.ts
 * The section page displays the specific information created for the designated section number.
 * 
 * The information for the section number is determined by retrieving the current plan information and then retrieving the section index number.
 * 
 * 
 */

import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, PopoverController } from '@ionic/angular'
import { ActivatedRoute, Router, NavigationExtras, NavigationEnd } from '@angular/router';
import { ContentCycleProviderService } from '../../services/content-cycle-provider.service';
import { JournalProviderService } from '../../services/journal-provider.service';
import { PrayerRequestProviderService } from '../../services/prayer-request-provider.service';
import { TagProviderService } from 'src/app/services/tag-provider.service';
import { Section } from 'src/app/interfaces/section';
import { AddJournalPage } from '../add-journal/add-journal.page';
import { Journal } from 'src/app/interfaces/journal';
import { PrayerRequest } from 'src/app/interfaces/prayer-request';
import { Tag } from 'src/app/interfaces/tag';
import { GlobalProviderService } from 'src/app/services/global-provider.service';
import { EditPrayerCardComponent } from 'src/app/components/edit-prayer-card/edit-prayer-card.component';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-section',
  templateUrl: './section.page.html',
  styleUrls: ['./section.page.scss'],
})
export class SectionPage implements OnInit {

  sectionIndex: number;
  section: Section;
  contentCycleName: string;
  journals: Journal[] = [];
  tag: Tag;
  allPrayers$: Observable<PrayerRequest[]> = this.prayerService.fetchUsersPrayers()
  filteredPrayers: PrayerRequest[]

  get showSpinner() {
    return this.globalServices.showSpinner;
  }

  constructor(
    private journalService: JournalProviderService,
    private prayerService: PrayerRequestProviderService,
    private tagService: TagProviderService,
    private modalController: ModalController,
    private route: ActivatedRoute,
    private router: Router,
    private contentCycleService: ContentCycleProviderService,
    private globalServices: GlobalProviderService,
    private navCtrl: NavController,
    public popoverController: PopoverController
  ) {

  }

  /**
   * Standard ionic function that runs everytime we go to this page
   *
   * @memberof SectionPage
   */
  async ionViewWillEnter() {
    await this.globalServices.loadContent(this, this.getAndOrganizeData);
  }

  /**
   * Function used to setup all data for this page asynchronously
   *
   * @param {*} thisPage Acts as "this" normally would but since we call it from the global class it has to use a variable
   * @memberof SectionPage
   */
  async getAndOrganizeData(thisPage) {
    thisPage.sectionIndex = +thisPage.route.snapshot.paramMap.get('sectionNumber');
    await thisPage.contentCycleService.getCurrentPlanInformation();
    thisPage.section = thisPage.contentCycleService.orderedSections[thisPage.sectionIndex];
    thisPage.contentCycleName = thisPage.contentCycleService.currentPlan.Title;
    thisPage.journals = thisPage.setJournals(thisPage.contentCycleService.sectionJournalsBySection[thisPage.section.Id]);
    await thisPage.contentCycleService.updateUserHasPlan(thisPage.section.Id, thisPage.contentCycleService.userPlan.Times_Completed);
  }

  ngOnInit() {
    this.sectionIndex = +this.route.snapshot.paramMap.get('sectionNumber')
    this.section = this.contentCycleService.orderedSections[this.sectionIndex]
    this.prayerService.getThisUsersPrayersAsObservable().subscribe()
    this.allPrayers$.subscribe(prayers => {
      console.log('Prayers: ', prayers)
      this.filteredPrayers = prayers.filter(prayer => prayer.Section_Id === this.section.Id)
    })
  }

  setJournals(passedInJournals) {
    if (passedInJournals) {
      passedInJournals = this.journalService.setJournalsDates(passedInJournals);
    } else {
      passedInJournals = [];
    }

    return passedInJournals
  }

  goToNextSection() {
    let nextIndex;
    if (this.sectionIndex !== this.contentCycleService.orderedSections.length - 1) {
      nextIndex = this.sectionIndex + 1;
    } else {
      nextIndex = 0;
    }

    let nextSection = this.contentCycleService.orderedSections[nextIndex];
    if (nextSection.Order === 1 && nextSection.ContentCycle_Number === 1) {
      this.globalServices.sendSuccessToast(`Wow you did it! You finished the plan! Feel free to start over and continue!`);
      this.contentCycleService.userPlan.Times_Completed++;
    } else if (nextSection.Order === 1) {
      this.globalServices.sendSuccessToast(`Nice job! You just finished a cycle! Make sure to stay diligent so you can finish the plan. `);
    }

    this.navCtrl.navigateForward(['/section/' + nextIndex]);
  }
  goToPreviousSection() {
    if (this.sectionIndex !== 0) {
      let previousIndex = this.sectionIndex - 1;
      this.navCtrl.navigateBack(['/section/' + previousIndex]);
    }
  }

  async openCreateJournalModal() {
    const modal = await this.modalController.create({
      component: AddJournalPage,
      componentProps: {
        'sectionId': this.section.Id,
      }
    });
    let _this = this;
    modal.onDidDismiss().then(async (dataReturned) => {
      if (dataReturned !== null) {
        await _this.globalServices.loadContent(_this, _this.getAndOrganizeData);;
      }
    });

    return await modal.present();
  }

  goToJournal(journal) {
    let navigationExtras: NavigationExtras = {
      state: {
        journal: journal
      }
    }
    this.router.navigate(['/journal'], navigationExtras);
  }

  goToPrayer(prayer) {
    let navigationExtras: NavigationExtras = {
      state: {
        request: prayer
      }
    }
    this.router.navigate(['/prayer-request'], navigationExtras);
  }

  //Trigger prayer creation popup
  async presentPrayerPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: EditPrayerCardComponent,
      componentProps: {
        'sectionId': this.section.Id,
      },
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
//Functionality
  goToContentCycle() {
    this.navCtrl.navigateBack(['/content-cycle/']);
  }

}