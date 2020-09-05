import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserProviderService } from '../../services/user-provider.service';
import { ContentCycleProviderService } from '../../services/content-cycle-provider.service';
import { ChatProviderService } from 'src/app/services/chat-provider.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  emailErrors: boolean = false;
  passwordErrors: boolean = false;
  serverErrors: boolean = false;
  serverError: string;

  /**
   * Creates an instance of LoginPage.
   * @param {UserProviderService} usersService
   * @param {FormBuilder} formBuilder
   * @param {Router} router
   * @memberof LoginPage
   */
  constructor(
    public usersService: UserProviderService, 
    public formBuilder: FormBuilder, 
    private router: Router, 
    private contentCycleService: ContentCycleProviderService,
    private chatServices: ChatProviderService
    ) {

    // Creates the login form with validators
    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"), Validators.required])],
      password: ['', Validators.compose([Validators.required])],
    });

  }

  /**
   * Runs on initialization of this page
   *
   * @memberof LoginPage
   */
  async ngOnInit() {
    try {

      // Checks to see if it's necessary to login via the access token, if it isn't then it goes to the home page
      let user = await this.usersService.verifyAccessToken();
      this.router.navigate(['/content-cycle']);

    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Handles whenever the user hits the login button
   *
   * @memberof LoginPage
   */
  async login() {

    this.resetServerErrors();

    // Check if there are email or password errors
    if (!this.loginForm.controls.email.valid || !this.loginForm.controls.password.valid) {
      this.emailErrors = true;
      this.passwordErrors = true;
      return
    }

    try {

      // Send login form values to the server to check login, on success go to home page
      let formValues = this.loginForm.value;
      let user = await this.usersService.login(formValues.email, formValues.password);
      let notifications = await this.chatServices.getUserNotifications();
      this.router.navigate(['/content-cycle']);

    } catch (error) {

      // Display the server errors
      this.serverErrors = true;
      this.serverError = error;

    }
  }

  /**
   * Utility funciton to reset server errors
   *
   * @memberof LoginPage
   */
  resetServerErrors() {
    this.serverError = '';
    this.serverErrors = false;
  }

  /**
   * This function handles clearing all input fields when the value changes
   *
   * @param {*} event
   * @memberof RegisterPage
   */
  genericInputChange(event) {
    let errorVariableName = event.srcElement.parentElement.id + 'Errors';
    this[errorVariableName] = false;
  }



}
