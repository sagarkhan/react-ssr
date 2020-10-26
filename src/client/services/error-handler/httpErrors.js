/* eslint-disable import/prefer-default-export */
import ErrorService from './error-handler.service';
import StorageService from '../storage/storage.service';
import { SESSION, EVENT_STATUS, isMobile, AGENT } from '../../utils/constants';
import EventService from '../events/events.service';
import { getRedirectURL } from '../../utils/helpers';

export const httpErrors = error => {
  const payload = {};
  const isMobileClient =
    isMobile(StorageService.get(SESSION.AGENT)) &&
    StorageService.get(SESSION.AGENT) !== AGENT.MOBILE;

  if (error.code === 'ECONNABORTED') {
    payload.title = 'Connection Timeout';
    payload.message =
      'We were unable to reach our servers, Please try again later';
    payload.handler = () => window.location.reload();
  } else {
    switch (error.status) {
      case 0:
        payload.title = 'Connection Timeout';
        payload.message =
          'We were unable to reach our servers, Please try again later';
        break;
      default:
        payload.title = 'Oops, Something went wrong !!!';
        payload.message = error.message || '';
    }

    switch (error.error_code) {
      case 'ERR_NOT_ELIGIBLE_FOR_REPAY':
        payload.title = 'Repayment not available';
        payload.message = error.message;
        payload.handler = () => {
          if (isMobileClient) {
            EventService.postMessage(EVENT_STATUS.TIMEOUT);
          } else {
            window.location.href = getRedirectURL();
          }
        };
        break;
      case 'ERR_LAST_PAYMENT_SUCCESSFUL':
        payload.title = 'Payment Received';
        payload.message = 'We have already received payment for this order.';
        payload.handler = () => {
          if (isMobileClient) {
            EventService.postMessage(EVENT_STATUS.SUCCESS);
          } else {
            window.location.href = getRedirectURL();
          }
        };
        break;
      case 'invalid_transaction':
        ErrorService.emit(ErrorService.applicationErrors.invalid_session);
        return;
      case 'unauthorized':
        payload.title = 'Unauthorized';
        payload.message = error.message;
        payload.handler = () => {
          if (isMobileClient) {
            EventService.postMessage(EVENT_STATUS.UNAUTHORIZED);
          } else {
            window.location.href = getRedirectURL();
          }
        };
        break;
      default:
        payload.title = 'Oops, Something went wrong !!!';
        payload.message = error.message || '';
        payload.handler = () => {
          if (isMobileClient) {
            EventService.postMessage(EVENT_STATUS.UNAUTHORIZED);
          } else {
            window.location.href = getRedirectURL();
          }
        };
    }
  }
  ErrorService.emit(payload);
};
