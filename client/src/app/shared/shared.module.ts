import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'

import { HeaderComponent } from '../components/layout/header/header.component';
import { EditPrayerCardComponent } from '../components/edit-prayer-card/edit-prayer-card.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ],
  declarations: [
      HeaderComponent,
      EditPrayerCardComponent
  ],
  exports: [
      HeaderComponent,
      EditPrayerCardComponent
  ],
  entryComponents: [EditPrayerCardComponent]
})
export class SharedModule { }
