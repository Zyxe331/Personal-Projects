import { Component, OnInit } from '@angular/core';
import { Notification } from 'src/app/interfaces/notification';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatProviderService } from 'src/app/services/chat-provider.service';
import { GlobalProviderService } from 'src/app/services/global-provider.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {

  notification: Notification = new Notification();

  get showSpinner() {
    return this.globalServices.showSpinner;
  }  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatServices: ChatProviderService,
    private globalServices: GlobalProviderService
   ) {
  //   this.route.queryParams.subscribe(params => {
  //     if (this.router.getCurrentNavigation().extras.state) {
  //       this.notification = this.router.getCurrentNavigation().extras.state.notification;
  //     }
  //   })
  }

  //Added functionality inside of ngOnInit() that redirects the user back to the 
  //notifications page when the user tries to refresh while inside of a notification
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.notification = this.router.getCurrentNavigation().extras.state.notification;
        console.log(this.router.getCurrentNavigation().extras.state)
      }
      else {
        this.router.navigate(['/notifications'])
      }
    })
  }

  /**
   * Standard ionic function that runs everytime we go to this page
   *
   * @memberof NotificationPage
   */
  async ionViewWillEnter() {
    await this.globalServices.loadContent(this, this.getAndOrganizeData);
  }

  /**
   * Function used to setup all data for this page asynchronously
   *
   * @param {*} thisPage Acts as "this" normally would but since we call it from the global class it has to use a variable
   * @memberof NotificationPage
   */
  async getAndOrganizeData(thisPage) {
    if (!thisPage.notification.Read) {
      await thisPage.chatServices.readNotification(thisPage.notification.Id, thisPage.notification.Completed);
    }
  }

  acceptUser() {

    try {
      this.chatServices.acceptUserIntoGroup(this.notification.Id, this.notification.From_User_Id, this.notification.To_User_Id, this.notification.Group_Id);
      this.router.navigate(['/notifications']);
    } catch (e) {
      console.log(e);
    }

  }

  async declineUser() {
    try {
      await this.chatServices.rejectUserFromGroup(this.notification.Id, this.notification.From_User_Id, this.notification.To_User_Id, this.notification.Group_Id);
      this.router.navigate(['/notifications']);
    } catch (e) {
      console.log(e);
    }

  }

}
