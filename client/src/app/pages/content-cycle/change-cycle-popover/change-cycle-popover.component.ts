import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {PopoverController} from '@ionic/angular';
import { ChatProviderService } from 'src/app/services/chat-provider.service';
import { UserProviderService } from 'src/app/services/user-provider.service';


@Component({
  selector: 'app-change-cycle-popover',
  templateUrl: './change-cycle-popover.component.html',
  styleUrls: ['./change-cycle-popover.component.scss'],
})
export class ChangeCyclePopoverComponent implements OnInit {
  @Input() groupId: number
  constructor(private router: Router, private popover: PopoverController, private chatService: ChatProviderService, private userService: UserProviderService ) {}

  ngOnInit() {}

  ClosePopover() {
    this.popover.dismiss()
  }

  ClosePopoverAndNav() {
    this.popover.dismiss()
    let userId = this.userService.getUserFromStorage().Id
    this.chatService.removeUser(this.groupId, userId).then(res => {
      location.reload() // This is kind of a hack to get the content to reload, replace this with some subjects to get the content to reload.
    })
  }

}
