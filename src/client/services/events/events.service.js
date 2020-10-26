/* eslint-disable no-console */
import StorageService from '../storage/storage.service';
import { SESSION, AGENT, EVENT_STATUS } from '../../utils/constants';

class Events {
  constructor() {
    this.success = {
      type: 'http',
      code: 'payment_success',
      message: 'Success',
      status: 200,
    };
    this.pending = {
      type: 'http',
      code: 'payment_pending',
      message: 'Pending',
      status: 202,
    };
    this.noContent = {
      type: 'http',
      code: 'not_available',
      message: 'No content',
      status: 204,
    };
    this.badRequest = {
      type: 'http',
      code: 'invalid_params',
      message: 'Bad Request',
      status: 400,
    };
    this.unauthorized = {
      type: 'http',
      code: 'unauthorized',
      message: 'Unauthorized',
      status: 401,
    };
    this.forbidden = {
      type: 'http',
      code: 'forbidden',
      message: 'Forbidden',
      status: 403,
    };
    this.timeout = {
      type: 'http',
      code: 'timeout',
      message: 'timeout',
      status: 408,
    };
    this.failed = {
      type: 'http',
      code: 'payment_failed',
      message: 'Failed',
      status: 422,
    };
    this.internalError = {
      type: 'http',
      code: 'service_error',
      message: 'Internal Server error',
      status: 500,
    };
    this.backEvent = {
      type: 'keypress',
      code: 'back',
      message: 'Back',
      status: 37,
    };
  }

  postMessage(status) {
    const { commonReducer } = window.store.getState();
    const { error = {} } = commonReducer;
    const callback = {};
    callback.inputParameters = StorageService.getSession();
    switch (status) {
      case EVENT_STATUS.SUCCESS:
        callback.event = this.success.code;
        callback.meta = {
          ...this.success,
          ...error,
        };
        break;
      case EVENT_STATUS.PENDING:
        callback.event = this.pending.code;
        callback.meta = {
          ...this.pending,
          ...error,
        };
        break;
      case EVENT_STATUS.FAILED:
        callback.event = this.failed.code;
        callback.meta = {
          ...this.failed,
          ...error,
        };
        break;
      case EVENT_STATUS.TIMEOUT:
        callback.event = this.timeout.code;
        callback.meta = {
          ...this.timeout,
          ...error,
        };
        break;
      case EVENT_STATUS.FORBIDDEN:
        callback.event = this.backEvent.code;
        callback.meta = {
          ...this.forbidden,
          ...error,
        };
        break;
      case EVENT_STATUS.UNAUTHORIZED:
        callback.event = this.backEvent.code;
        callback.meta = {
          ...this.unauthorized,
          ...error,
        };
        break;
      case EVENT_STATUS.INVALID:
        callback.event = this.backEvent.code;
        callback.meta = {
          ...this.badRequest,
          ...error,
        };
        break;
      case EVENT_STATUS.SERVER_ERROR:
        callback.event = this.backEvent.code;
        callback.meta = {
          ...this.internalError,
          ...error,
        };
        break;
      case EVENT_STATUS.BACK:
        callback.event = this.backEvent.code;
        callback.meta = {
          ...this.backEvent,
          ...error,
        };
        break;
      default:
        callback.event = this.internalError;
        callback.meta = {
          ...this.internalError,
          ...error,
        };
    }
    const message = {
      callback,
    };
    this.publishMessage(JSON.stringify(message));
  }

  publishMessage(message) {
    try {
      if (StorageService.get(SESSION.AGENT) === AGENT.IOS) {
        window.webkit.messageHandlers.message.postMessage(message, '*');
      } else if (StorageService.get(SESSION.AGENT) === AGENT.ANDROID) {
        window.parent.postMessage(message, '*');
      }
      StorageService.clearAll();
    } catch (e) {
      console.log(e);
      console.log('failed to publish event');
    }
  }
}

const EventService = new Events();

export default EventService;
