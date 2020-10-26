import { Subject } from 'rxjs';
import StorageService from '../storage/storage.service';
import { applicationErrors } from './applicationErrors';

class Error {
  constructor() {
    this.errorEvent = new Subject();
    this.applicationErrors = applicationErrors;
  }

  emit(error) {
    StorageService.clearAll();
    this.errorEvent.next(error);
  }

  activate() {
    return this.errorEvent;
  }
}

const ErrorService = new Error();

export default ErrorService;
