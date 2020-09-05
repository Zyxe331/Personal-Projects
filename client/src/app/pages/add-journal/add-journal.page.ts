import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JournalProviderService } from '../../services/journal-provider.service';
import { GlobalProviderService } from '../../services/global-provider.service';
import { Journal } from 'src/app/interfaces/journal';

@Component({
  selector: 'app-add-journal',
  templateUrl: './add-journal.page.html',
  styleUrls: ['./add-journal.page.scss'],
})
export class AddJournalPage implements OnInit {

  addJournalForm: FormGroup;
  showErrors: boolean = false;
  serverErrors: boolean = false;
  serverError: string;
  thisDate: string;
  sectionId: number;

  get showSpinner() {
    return this.globalServices.showSpinner;
  }
  
  constructor(
    private modalController: ModalController,
    private journalService: JournalProviderService,
    private globalServices: GlobalProviderService,
    public formBuilder: FormBuilder,
    private router: Router,
  ) {

    // Creates the new journal form with validators
    this.addJournalForm = formBuilder.group({
      title: ['', Validators.compose([Validators.required])],
      body: ['', Validators.compose([Validators.required])],
    });

  }

  ngOnInit() {
    
  }

  async ionViewWillEnter() {
    await this.globalServices.loadContent(this, this.getAndOrganizeData);  
  }


  async getAndOrganizeData(thisPage) {
    thisPage.thisDate = thisPage.globalServices.createLongFormattedDate(new Date());
  }

  async save() {

    // Check if there are title or body errors
    if (!this.addJournalForm.controls.title.valid || !this.addJournalForm.controls.body.valid) {
      this.showErrors = true;
      return
    }

    try {

      // Send journal form values to the server to insert journal
      let formValues = this.addJournalForm.value;
      let journal = await this.journalService.addJournal(formValues.title, formValues.body, this.sectionId);
      this.globalServices.sendSuccessToast(`Way to go! You added a new journal "${journal.Title}"`);

      if (this.sectionId != undefined) {
        journal = this.journalService.setJournalDates(journal);
        this.dismiss(journal);
        
      } else {
        this.router.navigate(['/journals']);
      }


    } catch (error) {

      console.log(error);
      this.globalServices.sendErrorToast(`Sorry, something went wrong when attempting to add your new journal.`);

      // Display the server errors
      this.serverErrors = true;
      this.serverError = error;

    }

  }

  dismiss(journal: Journal) {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
      journal: journal
    });
  }

}
