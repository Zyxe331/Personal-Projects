import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {PopoverController} from '@ionic/angular';


@Component({
  selector: 'app-change-cycle-popover',
  templateUrl: './change-cycle-popover.component.html',
  styleUrls: ['./change-cycle-popover.component.scss'],
})
export class ChangeCyclePopoverComponent implements OnInit {

  constructor(private router: Router, private popover: PopoverController) {}

  ngOnInit() {}

  ClosePopover() {
    this.popover.dismiss()
  }

  ClosePopoverAndNav() {
    this.popover.dismiss()
    this.router.navigate(['/change-content-cycle'])
  }

}
