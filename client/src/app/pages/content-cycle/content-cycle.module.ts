import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ContentCyclePage } from './content-cycle.page';
import { ChangeCyclePopoverComponent } from './change-cycle-popover/change-cycle-popover.component'
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: ContentCyclePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [ContentCyclePage, ChangeCyclePopoverComponent],
  entryComponents: [ChangeCyclePopoverComponent]
})
export class ContentCyclePageModule {}