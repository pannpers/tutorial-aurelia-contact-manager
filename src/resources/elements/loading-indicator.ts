import {bindable, noView} from 'aurelia-framework';
import * as nproress from 'nprogress'
import 'nprogress/nprogress.css'

@noView
export class LoadingIndicator {
  @bindable loading = false

  loadingChanged(newValue: boolean) {
    newValue ? nproress.start() : nproress.done()
  }
}
