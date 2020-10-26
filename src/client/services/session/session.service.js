/* eslint-disable no-console */
/* Initalize global session variables */
import { SESSION } from '../../utils/constants';
import StorageService from '../storage/storage.service';

const sessionSetEvent = new Event('onSessionSet');
const initSession = (token, agent, timestamp) => {
  if (token && agent) {
    try {
      StorageService.set(SESSION.TOKEN, token);
      StorageService.set(SESSION.AGENT, agent);
      if (StorageService.get(SESSION.TIMESTAMP)) {
        StorageService.set(SESSION.TIMESTAMP, timestamp);
      }
    } catch (err) {
      console.error(err);
    }
    window.dispatchEvent(sessionSetEvent);
  }
};

class Session {
  initialize = () => {
    const { token = '', agent = '', timestamp = '' } =
      window['__APP_SESSION__'] || {};
    initSession(token, agent, timestamp);
    delete window['__APP_SESSION__'];
  };
}

const SessionService = new Session();

export default SessionService;
