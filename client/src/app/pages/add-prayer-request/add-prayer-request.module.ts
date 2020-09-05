import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddPrayerRequestPage } from './add-prayer-request.page';

const routes: Routes = [
  {
    path: '',
    component: AddPrayerRequestPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddPrayerRequestPage]
})
export class AddPrayerRequestPageModule {}
