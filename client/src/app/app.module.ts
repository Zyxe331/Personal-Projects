import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { AddJournalPageModule } from './pages/add-journal/add-journal.module'
import { LocalNotifications} from '@ionic-native/local-notifications/ngx'
import { SharedModule } from './shared/shared.module';
import { ContentCyclePageModule } from './pages/content-cycle/content-cycle.module';
import { ChangeContentCyclePageModule } from './pages/change-content-cycle/change-content-cycle.module';
import { GroupPageModule } from './pages/group/group.module';
import { JournalPageModule } from './pages/journal/journal.module';
import { NotificationPageModule } from './pages/notification/notification.module';
import { NotificationsPageModule } from './pages/notifications/notifications.module';
import { PrayerRequestPageModule } from './pages/prayer-request/prayer-request.module';
import { SectionPageModule } from './pages/section/section.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot({name: 'vetUserStorage',driverOrder: ['localstorage', 'sqlite', 'indexeddb']}),
    FormsModule, ReactiveFormsModule, AddJournalPageModule, SharedModule, 
    ContentCyclePageModule, ChangeContentCyclePageModule, GroupPageModule, JournalPageModule, NotificationPageModule, NotificationsPageModule, PrayerRequestPageModule, SectionPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    LocalNotifications,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
