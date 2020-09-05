import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Journal } from 'src/app/interfaces/journal';
import { JournalProviderService } from '../../services/journal-provider.service';
import { GlobalProviderService } from 'src/app/services/global-provider.service';

@Component({
  selector: 'app-journals',
  templateUrl: './journals.page.html',
  styleUrls: ['./journals.page.scss'],
})
export class JournalsPage implements OnInit {

  allJournals: Journal[];
  filteredJournals: Journal[];
  searchTerm: string;

  get showSpinner() {
    return this.globalServices.showSpinner;
  }  

  constructor(
    private journalService: JournalProviderService,
    private router: Router,
    private globalServices: GlobalProviderService
  ) { }

  ngOnInit() {

  }

  async ionViewWillEnter() {
    await this.globalServices.loadContent(this, this.getAndOrganizeData);
  }

  async getAndOrganizeData(thisPage) {
    thisPage.allJournals = await thisPage.journalService.getThisUsersJournals();
    thisPage.allJournals = thisPage.journalService.setJournalsDates(thisPage.allJournals);
    thisPage.filteredJournals = JSON.parse(JSON.stringify(thisPage.allJournals));
  }

  goToPage(journal) {
    let navigationExtras: NavigationExtras = {
      state: {
        journal: journal
      }
    }
    this.router.navigate(['/journal'], navigationExtras);
  }

  filterItems() {
    let searchTerm = this.searchTerm;
    this.filteredJournals = JSON.parse(JSON.stringify(this.allJournals));
    this.filteredJournals =  this.filteredJournals.filter(journal => {
      return journal.Title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

}
