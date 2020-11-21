import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PrayerRequestPage } from './prayer-request.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditPrayerCardComponent } from '../../components/edit-prayer-card/edit-prayer-card.component'

const routes: Routes = [
  {
    path: '',
    component: PrayerRequestPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [PrayerRequestPage, EditPrayerCardComponent]
})

export class PrayerRequestPageModule {}
