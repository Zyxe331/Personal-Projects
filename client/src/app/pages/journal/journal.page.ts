import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Journal } from 'src/app/interfaces/journal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JournalProviderService } from '../../services/journal-provider.service';
import { GlobalProviderService } from 'src/app/services/global-provider.service';

@Component({
  selector: 'app-journal',
  templateUrl: './journal.page.html',
  styleUrls: ['./journal.page.scss'],
})
export class JournalPage implements OnInit {

  journal: Journal;
  editMode: boolean = false;
  updateJournalForm: FormGroup;
  showErrors: boolean = false;
  serverErrors: boolean = false;
  serverError: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public formBuilder: FormBuilder,
    private journalService: JournalProviderService,
    private globalService: GlobalProviderService
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.journal = this.router.getCurrentNavigation().extras.state.journal;
      }
      // Creates the update Journal form with validators
      let thisJournal = this.journal;
      this.updateJournalForm = formBuilder.group({
        title: [thisJournal.Title, Validators.compose([Validators.required])],
        body: [thisJournal.Body, Validators.compose([Validators.required])],
      });
    });

  }

  ngOnInit() {
  }

  startEdit() {
    this.editMode = true;
  }

  cancel() {
    this.editMode = false;
    this.updateJournalForm.reset();
    this.updateJournalForm.setValue({ 'title': this.journal.Title, 'body': this.journal.Body });
  }

  async save() {

    console.log('test');

    // Check if there are title or body errors
    if (!this.updateJournalForm.controls.title.valid || !this.updateJournalForm.controls.body.valid) {
      this.showErrors = true;
      return
    }

    try {

      // Send journal form values to the server to insert journal
      let formValues = this.updateJournalForm.value;
      let journal = await this.journalService.updateJournal(this.journal.Id, formValues.title, formValues.body);
      this.globalService.sendSuccessToast(`Awesome, you have successfully updated your journal "${journal.Title}"`);

      this.journal = this.journalService.setJournalDates(journal);
      if (journal) {
        this.journal = journal;
        this.editMode = false;
      }

    } catch (error) {

      console.log(error);
      this.globalService.sendErrorToast(`Sorry, something went wrong when attempting to update your journal.`);

      // Display the server errors
      this.serverErrors = true;
      this.serverError = error;

    }

  }
}
