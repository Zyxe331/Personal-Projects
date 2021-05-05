/**
 * section.page.ts
 * The section page displays the specific information created for the designated section number.
 * 
 * The information for the section number is determined by retrieving the current plan information and then retrieving the section index number.
 * 
 * 
 */

 import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavController, ModalController, PopoverController, Gesture, GestureController, AnimationController } from '@ionic/angular'
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
import { Plan } from 'src/app/interfaces/plan';
import { UserPlan } from 'src/app/interfaces/user-plan';


@Component({
  selector: 'app-section',
  templateUrl: './section.page.html',
  styleUrls: ['./section.page.scss'],
})
export class SectionPage implements OnInit, AfterViewInit {
  plan: Plan
  userHasPlan: UserPlan
  sectionIndex: number;
  section: Section;
  contentCycleName: string;
  allJournals$: Observable<Journal[]> = this.journalService.fetchUsersJournals()
  filteredJournals: Journal[]
  tag: Tag;
  allPrayers$: Observable<PrayerRequest[]> = this.prayerService.fetchUsersPrayers()
  filteredPrayers: PrayerRequest[]
  @ViewChild('sectionContent', { read: ElementRef, static: true }) contentRef: ElementRef;

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
    public popoverController: PopoverController,
    private animationCtrl: AnimationController,
    private gestureCtrl: GestureController
  ) { }

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
    // await thisPage.contentCycleService.getUsersPlanInformation();
    // thisPage.contentCycleName = thisPage.contentCycleService.currentPlan.Title;
    // thisPage.journals = thisPage.setJournals(thisPage.contentCycleService.sectionJournalsBySection[thisPage.section.Id]);
    // await thisPage.contentCycleService.updateUserHasPlan(thisPage.section.Id, thisPage.contentCycleService.userPlan.Times_Completed);
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.plan = this.router.getCurrentNavigation().extras.state.plan;
        this.userHasPlan = this.router.getCurrentNavigation().extras.state.userHasPlan;
        this.sectionIndex = +this.route.snapshot.paramMap.get('sectionNumber')
        this.section = [].concat(...this.plan.sections).find(section => section.Id == this.sectionIndex)
        this.contentCycleName = this.section.Title
        this.prayerService.getThisUsersPrayersAsObservable().subscribe()
        this.allPrayers$.subscribe(prayers => {
          this.filteredPrayers = prayers.filter(prayer => prayer.Section_Id === this.section.Id)
        })
        this.journalService.getThisUsersJournalsAsObservable().subscribe()
        this.allJournals$.subscribe(journals => {
          this.filteredJournals = this.setJournals(journals.filter(journal => journal.Section_Id === this.section.Id))
        })
      }
      else {
        this.router.navigate(['/content-cycle'])
      }
    })
  }

  ngAfterViewInit() {

    // create gesture for swiping to next section
    const gesture: Gesture = this.gestureCtrl.create({
      el: this.contentRef.nativeElement,
      gesturePriority: 100,
      threshold: 5,
      gestureName: 'swipe-next-section',
      onStart: () => {
        this.contentRef.nativeElement.style.transition = "none";
      },
      onMove: detail => {
        this.contentRef.nativeElement.style.transform = `translateX(${detail.deltaX}px)`
      },
      onEnd: (detail) => {
        const style = this.contentRef.nativeElement.style
        style.transition = "0.3s ease-out";
        if (detail.deltaX > window.innerWidth / 2) {
          style.transform = `translateX(${window.innerWidth * 1.5}px)`;
          console.log('go back')
          this.goToPreviousSection();
          style.transform = ''
        } else if (detail.deltaX < -window.innerWidth / 2) {
          style.transform = `translateX(-${window.innerWidth * 1.5}px)`;
          console.log('go forward')
          this.goToNextSection();
        } else {
          style.transform = ''
        }
      }
    }, true);
    gesture.enable(true)
  }

  //If a user has journals written in a section, pass the journals into the section and use the journal provider service to set their dates in the list.
  setJournals(passedInJournals) {
    if (passedInJournals) {
      passedInJournals = this.journalService.setJournalsDates(passedInJournals);
    } else {
      passedInJournals = [];
    }

    return passedInJournals
  }

  goToNextSection() { // This function takes into account that the next section may be the next one in the order in the same cycle, or it may be the first section in the next cycle.

    let nextSection
    for(let i = 0; i < this.plan.sections.length; i++) {
      let currentCycle = this.plan.sections[i]
      let sectionIndex = currentCycle.findIndex(section => section.Id == this.section.Id)
      if(sectionIndex != -1 && sectionIndex != currentCycle.length - 1) {
        nextSection = currentCycle[sectionIndex + 1]
      }
      else if(sectionIndex != -1 && i != this.plan.sections.length - 1) {
        this.globalServices.sendSuccessToast(`Nice job! You just finished a cycle! Make sure to stay diligent so you can finish the plan. `);
        nextSection = this.plan.sections[i+1][0]
      }
      else if(sectionIndex != -1) {
        nextSection = this.plan.sections[0][0]
        this.userHasPlan.Times_Completed++
        this.globalServices.sendSuccessToast(`Wow you did it! You finished the plan! Feel free to start over and continue!`)
      }
    }
    let navigationExtras: NavigationExtras = {
      state: {
        plan: this.plan,
        userHasPlan: this.userHasPlan
      }
    }
    this.contentCycleService.updateUserHasPlan(this.userHasPlan.Id, nextSection.Id, this.userHasPlan.Times_Completed).subscribe()
    this.navCtrl.navigateForward(['/section/' + nextSection.Id], navigationExtras)
  }
  goToPreviousSection() {
    let navigationExtras: NavigationExtras = {
      state: {
        plan: this.plan,
        userHasPlan: this.userHasPlan
      }
    }
    if (this.sectionIndex !== this.plan.sections[0][0].Id) {
      let previousIndex = this.sectionIndex - 1;
      this.contentCycleService.updateUserHasPlan(this.userHasPlan.Id, this.section.Id, this.userHasPlan.Times_Completed).subscribe()
      this.navCtrl.navigateBack(['/section/' + previousIndex], navigationExtras); //was navigateBack but it broke
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
      showBackdrop: true,
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
//Takes you back to the content cycle using the back arrow.
  goToContentCycle() {
    this.navCtrl.navigateBack(['/content-cycle/']);
  }

}