import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Group } from 'src/app/interfaces/group';
import { GroupProviderService } from '../../services/group-provider-service';
import { GlobalProviderService } from 'src/app/services/global-provider.service';


@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
})
export class GroupsPage implements OnInit {

  allGroups: Group[];
  filteredGroups : Group[];
  searchTerm: string;

  get showSpinner() {
    return this.globalServices.showSpinner;
  }
  constructor(
    private groupService: GroupProviderService,
    private router: Router,
    private globalServices: GlobalProviderService
  ) { }

  ngOnInit() {
    this.groupService.getThisUsersGroups().subscribe(groups => {
      this.allGroups = groups
      this.filteredGroups = JSON.parse(JSON.stringify(groups));
    })
  }

  // async ionViewWillEnter() {
  //   await this.globalServices.loadContent(this, this.getAndOrganizeData);
  // }

  // async getAndOrganizeData(thisPage) {
  //   thisPage.allGroups = await thisPage.groupService.getThisUsersGroups();
  //   thisPage.allGroups = thisPage.groupService.setGroupsDates(thisPage.allGroups);
  //   thisPage.filteredGroups = JSON.parse(JSON.stringify(thisPage.allGroups));
  // }

  goToPage(group) {
    let navigationExtras: NavigationExtras = {
      state: {
        group: group
      }
    }
    this.router.navigate(['/group'], navigationExtras);
  }

  filterItems() {
    let searchTerm = this.searchTerm;
    this.filteredGroups = JSON.parse(JSON.stringify(this.allGroups));
    this.filteredGroups =  this.filteredGroups.filter(group => {
      return group.Name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

}
