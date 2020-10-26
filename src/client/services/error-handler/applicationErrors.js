/* eslint-disable import/prefer-default-export */
import { getRedirectURL } from '../../utils/helpers';
import { isMobile, SESSION, EVENT_STATUS, AGENT } from '../../utils/constants';
import StorageService from '../storage/storage.service';
import EventService from '../events/events.service';

export const applicationErrors = {
  timeout: {
    title: 'Timeout',
    message: 'Your request session has been expired.',
    handler: () => {
      if (
        isMobile(StorageService.get(SESSION.AGENT)) &&
        StorageService.get(SESSION.AGENT) !== AGENT.MOBILE
      ) {
        EventService.postMessage(EVENT_STATUS.TIMEOUT);
      } else {
        StorageService.clearAll();
        window.location.href = getRedirectURL();
      }
    },
  },
  invalid_session: {
    title: 'Invalid Session',
    message: 'Session validation failed. Error in creating session',
    handler: () => {
      if (
        isMobile(StorageService.get(SESSION.AGENT)) &&
        StorageService.get(SESSION.AGENT) !== AGENT.MOBILE
      ) {
        EventService.postMessage(EVENT_STATUS.FORBIDDEN);
      } else {
        StorageService.clearAll();
        window.location.href = getRedirectURL();
      }
    },
  },
  internal_error: {
    title: 'Something went wrong',
    message: 'App encountered an error state and cannot recover from it',
    handler: () => {
      if (
        isMobile(StorageService.get(SESSION.AGENT)) &&
        StorageService.get(SESSION.AGENT) !== AGENT.MOBILE
      ) {
        EventService.postMessage(EVENT_STATUS.SERVER_ERROR);
      } else {
        StorageService.clearAll();
        window.location.href = getRedirectURL();
      }
    },
  },
};
