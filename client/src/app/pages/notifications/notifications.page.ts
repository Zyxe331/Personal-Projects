import { Component, OnInit } from '@angular/core';
import { Notification } from '../../interfaces/notification';
import { ChatProviderService } from 'src/app/services/chat-provider.service';
import { Router, NavigationExtras  } from '@angular/router';
import { GlobalProviderService } from 'src/app/services/global-provider.service';
import { PrayerRequestProviderService } from 'src/app/services/prayer-request-provider.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  notifications: Notification[];

  get showSpinner() {
    return this.globalServices.showSpinner;
  }

  constructor(
    private chatServices: ChatProviderService,
    private globalServices: GlobalProviderService,
    private router: Router,
    private prayerServices: PrayerRequestProviderService
  ) { }

  ngOnInit() {
    
  }

  /**
   * Standard ionic function that runs everytime we go to this page
   *
   * @memberof NotificationsPage
   */
  async ionViewWillEnter() {
    await this.globalServices.loadContent(this, this.getPrayerRequestNotifications) // Get peayer request notifications every time user loads notifications page
    await this.globalServices.loadContent(this, this.getAndOrganizeData);
  }

  /**
   * Function used to setup all data for this page asynchronously
   *
   * @param {*} thisPage Acts as "this" normally would but since we call it from the global class it has to use a variable
   * @memberof NotificationsPage
   */
  async getAndOrganizeData(thisPage) {
    thisPage.notifications = await thisPage.chatServices.getUserNotifications();
    for (let i = 0; i < thisPage.notifications.length; i++) {
      if (!thisPage.notifications[i].Read) {
        thisPage.notifications[i].Color = 'light';
      }
    }
  }

  goToPage(notification) {
    let navigationExtras: NavigationExtras = {
      state: {
        notification: notification
      }
    }
    this.router.navigate(['/notification'], navigationExtras);
  }

  async markAllRead() {
    let unreadNotificationIds = [];
    this.notifications.forEach(notification => {
      if (!notification.Read) {
        unreadNotificationIds.push(notification.Id);
      }
    })

    await this.chatServices.markNotificationsAsRead(unreadNotificationIds);
    await this.globalServices.loadContent(this, this.getAndOrganizeData);
  }

  async getPrayerRequestNotifications(thisPage) {
    // Call function to create notifications for necessary requests
    thisPage.notifications = await thisPage.prayerServices.getPrayerRequestNotifications();
    // Handle notification color if not read
    for (let i = 0; i < thisPage.notifications.length; i++) {
      if (!thisPage.notifications[i].Read) {
        thisPage.notifications[i].Color = 'light';
      }
    }
  }

}
