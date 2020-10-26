import { SESSION } from '../../utils/constants';
import { loader } from '../../store/common/actions/common.actions';

class Common {
  getHeaders() {
    return {
      token: this.get(SESSION.TOKEN),
    };
  }

  showLoader() {
    const { store = null } = window;
    if (store) {
      store.dispatch(loader(true));
    }
  }

  hideLoader() {
    const { store = null } = window;
    if (store) {
      store.dispatch(loader(false));
    }
  }
}

const CommonService = new Common();

export default CommonService;
