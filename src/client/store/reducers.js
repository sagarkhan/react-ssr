import { combineReducers } from 'redux';
import CommonReducer from './common/reducers/common.reducers';

const rootReducers = combineReducers({
  commonReducer: CommonReducer,
});

export default rootReducers;
