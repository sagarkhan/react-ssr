import Axios from 'axios';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
import CommonService from '../services/common/common.service';

class HttpService {
  getHeaders() {
    return { headers: CommonService.getHeaders() };
  }

  get(url, config = {}) {
    return from(Axios.get(url, { ...config, ...this.getHeaders() }))
      .pipe(map(response => response.data))
      .toPromise();
  }

  post(url, data, config = {}) {
    return from(Axios.post(url, data, { ...config, ...this.getHeaders() }))
      .pipe(map(response => response.data))
      .toPromise();
  }

  put(url, data, config = {}) {
    return from(Axios.put(url, data, { ...config, ...this.getHeaders() }))
      .pipe(map(response => response.data))
      .toPromise();
  }

  delete(url, data, config = {}) {
    return from(Axios.delete(url, { ...this.getHeaders(), data, ...config }))
      .pipe(map(response => response.data))
      .toPromise();
  }
}

const HttpClient = new HttpService();

export default HttpClient;
