import { IDispatch } from 'concent';
import * as reducer from './reducer';

// export async function initState(){}

// export function loaded(dispatch: IDispatch) {}

export function mounted(dispatch: IDispatch) {
  dispatch(reducer.initState);
  return false;
}

export function willUnmount(dispatch: IDispatch) {
  dispatch(reducer.clear);
  return false;
}