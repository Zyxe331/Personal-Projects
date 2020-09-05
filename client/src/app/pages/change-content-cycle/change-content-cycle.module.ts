import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ChangeContentCyclePage } from './change-content-cycle.page';

const routes: Routes = [
  {
    path: '',
    component: ChangeContentCyclePage
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
  declarations: [ChangeContentCyclePage]
})
export class ChangeContentCyclePageModule {}
