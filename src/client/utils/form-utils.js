import validator from 'validator';
import { Subject } from 'rxjs';

const resetFormSubject = new Subject();

export const checkInitialValid = inputValues => {
  const defaults = Object.values(inputValues);
  let flag = true;
  if (!defaults.length) {
    flag = false;
  }
  defaults.forEach(item => {
    if (validator.isEmpty(item.toString())) {
      flag = false;
    }
  });
  return flag;
};

export const resetForm = emit => {
  if (emit) {
    return resetFormSubject.next(emit);
  }
  return resetFormSubject.asObservable();
};

/* Converts form value to uppercase */
export const PIPE__UPPERCASE = e => {
  if (e.target.value && typeof e.target.value === 'string') {
    e.target.value = e.target.value.toUpperCase();
  }
  return e;
};

/* Allow meta keys like backspace, delete, tab, escape, enter */
const allowedKeys = [8, 9, 13, 27, 37, 38, 39, 40, 46, 110];

export const PIPE__NUMLOCK = e => {
  const charCode = e.keyCode;
  if (
    !(charCode >= 48 && charCode <= 57) &&
    !(charCode >= 96 && charCode <= 105) &&
    allowedKeys.indexOf(charCode) === -1 &&
    !(
      (e.keyCode === 65 || e.keyCode === 86 || e.keyCode === 67) &&
      (e.ctrlKey === true || e.metaKey === true)
    )
  ) {
    e.preventDefault();
  }
};
