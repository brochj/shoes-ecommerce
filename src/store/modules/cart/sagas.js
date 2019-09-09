import { call, put, all, takeLatest } from 'redux-saga/effects';
import api from '../../../services/api';

import { addToCartSuccess } from './actions';

function* addToCart({ id }) {
  const response = yield call(api.get, `/products/${id}`);

  // put é para disparar actions
  yield put(addToCartSuccess(response.data));
}

// all é pra ficar ouvindo as actions
export default all([takeLatest('@cart/ADD_REQUEST', addToCart)]);
