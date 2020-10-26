import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { AddJournalPageModule } from './pages/add-journal/add-journal.module'
import { AddPrayerRequestPageModule } from './pages/add-prayer-request/add-prayer-request.module';
import { LocalNotifications} from '@ionic-native/local-notifications/ngx'

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot({name: 'vetUserStorage',driverOrder: ['localstorage', 'sqlite', 'indexeddb']}),
    FormsModule, ReactiveFormsModule, AddJournalPageModule,AddPrayerRequestPageModule
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
