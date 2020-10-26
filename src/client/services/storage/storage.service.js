import environments from '../../environments/environments';
import { SESSION, STORAGE_ENGINE } from '../../utils/constants';

export class Storage {
  constructor(engine) {
    this.error = new Error();
    this.engine = engine;
  }

  getStorage() {
    switch (this.engine) {
      case STORAGE_ENGINE.LOCAL:
        return localStorage;
      case STORAGE_ENGINE.SESSION:
        return sessionStorage;
      default:
        this.error.status = 409;
        this.error.message = 'Invalid storage engine';
        throw this.error;
    }
  }

  set(key, value) {
    if (key && value) {
      this.getStorage().setItem(key, value);
      return this.get(key);
    }
    this.error.status = 400;
    this.error.message = `Invalid parameters has been passed to set session Key = ${key}, Value = ${value})`;
    throw this.error;
  }

  get(key) {
    if (key) {
      return this.getStorage().getItem(key);
    }
    this.error.status = 400;
    this.error.message = `Invalid parameters has been passed to get session Key = ${key}`;
    throw this.error;
  }

  getAll() {
    const session = {};
    const sessionVariables = this.sessionKeys();
    sessionVariables.forEach(key => {
      session[key] = this.get(key) || '';
    });
    return session;
  }

  remove(key) {
    this.getStorage().removeItem(key);
  }

  clearAll() {
    Object.values(SESSION).forEach(key => {
      this.remove(key);
    });
  }

  sessionKeys() {
    return [SESSION.TOKEN];
  }
}

const StorageService = new Storage(environments.STORAGE);
export default StorageService;
