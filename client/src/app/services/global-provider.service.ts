import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class GlobalProviderService {

  public showSpinner: boolean = true;

  constructor(
    private toastController: ToastController
  ) { }

  /**
   * Turns a date into a longer, well formatted string 
   *
   * @param {Date} priorDate
   * @returns
   * @memberof GlobalProviderService
   */
  public createLongFormattedDate(priorDate: Date) {
    let formatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
    return priorDate.toLocaleDateString("en-US", formatOptions);
  }

  /**
   * Turns a date into a shorter, well formatted string
   *
   * @param {Date} priorDate
   * @returns
   * @memberof GlobalProviderService
   */
  public createShortFormattedDate(priorDate: Date) {
    let formatOptions = { month: 'short', day: 'numeric' };
    return priorDate.toLocaleDateString("en-US", formatOptions);
  }

  public async sendSuccessToast(message: string) {
    const toast = await this.toastController.create({
      color: 'success',
      message: message,
      duration: 4000
    });
    toast.present();
  }

  public async sendErrorToast(message: string) {
    const toast = await this.toastController.create({
      color: 'danger',
      message: message,
      duration: 2000
    });
    toast.present();
  }

  public async loadContent(thisPage, functionToLoad: Function) {
    console.log('loading');
    try {
      this.showSpinner = true;
      await functionToLoad(thisPage);
      this.showSpinner = false;
    } catch (e) {
      console.log(e);
      this.sendErrorToast('Something went wrong loading this pages content, try logging out and back in.')
    }
  }

}
