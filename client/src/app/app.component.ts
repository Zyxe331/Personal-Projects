import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Platform, Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { UserProviderService } from './services/user-provider.service';
import { User } from './interfaces/user';
import { ChatProviderService } from './services/chat-provider.service';
import { ContentCycleProviderService } from './services/content-cycle-provider.service';
import { TagProviderService } from './services/tag-provider.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    public appPages = [
        {
            title: 'Cycle',
            url: '/content-cycle',
            icon: 'home'
        },
        {
            title: 'Groups',
            url: '/groups',
            icon: 'list'
        },
        {
            title: 'Journals',
            url: '/journals',
            icon: 'list'
        },
        {
            title: 'Prayers',
            url: '/prayer-requests',
            icon: 'list'
        },
        {
            title: 'Notifications',
            url: '/notifications',
            icon: 'list'
        }
    ];
    public currentUser: User = {
        Id: 0,
        FirstName: '',
        LastName: '',
        Username: '',
        Email: '',
        Password: '',
        Active: false,
        CreatedDate: new Date(),
        PhoneNumber: '',
        Role_Id: 0,
        StopNudge: false
    };

    public numberOfUnreadNotifications: number;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private userService: UserProviderService,
        private router: Router,
        private events: Events,
        private storage: Storage,
        private chatService: ChatProviderService,
        private cycleServices: ContentCycleProviderService,
        private tagServices: TagProviderService
    ) {
        this.initializeApp();

        let _this = this;
        this.events.subscribe('setUser', () => {
            _this.currentUser = _this.userService.currentUser;
        });

        
    }

    initializeApp() {
        this.storage.get('USER').then(user => {
            this.userService.currentUser = user
            this.platform.ready().then(() => {
                this.statusBar.styleDefault();
                this.splashScreen.hide();
            });  
        })
    }

    async logout() {
        await this.userService.logout();
        this.router.navigate(['/login']);
        this.chatService.clearProperties();
        this.cycleServices.clearProperties();
        this.tagServices.clearProperties();
    }

    public study: boolean = false;

    updateDriverStudyMode(event) {
        this.study = !this.study;

        let notificationButton = document.getElementById('notifications');
        if (this.study || this.numberOfUnreadNotifications== 0) {
            notificationButton.style.display = 'none';
            document.getElementById('showOFF').id = 'showON';
        } else {
            document.getElementById('showON').id = 'showOFF';
            notificationButton.style.display = 'block';
        }
    }


    fitText(outputSelector){
        // max font size in pixels
        const maxFontSize = 50;
        // get the DOM output element by its selector
        let outputDiv = document.getElementById(outputSelector);
        // get element's width
        let width = outputDiv.clientWidth;
        // get content's width
        let contentWidth = outputDiv.scrollWidth;
        // get fontSize
        let fontSize = parseInt(window.getComputedStyle(outputDiv, null).getPropertyValue('font-size'),10);
        // if content's width is bigger then elements width - overflow
        if (contentWidth > width){
            fontSize = Math.ceil(fontSize * width/contentWidth);
            fontSize =  fontSize > maxFontSize  ? fontSize = maxFontSize  : fontSize - 1;
            outputDiv.style.fontSize = fontSize+'px';   
        }else{
            // content is smaller then width... let's resize in 1 px until it fits 
            while (contentWidth === width && fontSize < maxFontSize){
                fontSize = Math.ceil(fontSize) + 1;
                fontSize = fontSize > maxFontSize  ? fontSize = maxFontSize  : fontSize;
                outputDiv.style.fontSize = fontSize+'px';   
                // update widths
                width = outputDiv.clientWidth;
                contentWidth = outputDiv.scrollWidth;
                if (contentWidth > width){
                    outputDiv.style.fontSize = fontSize-1+'px'; 
                }
            }
        }
    }
    onMenuOpen() {
        this.numberOfUnreadNotifications = this.chatService.currentUnreadNotifications;
        if (this.numberOfUnreadNotifications == 0){}
        this.fitText("username");
    }

}