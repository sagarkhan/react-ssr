import React from 'react';
import PropTypes from 'prop-types';
import styles from './form-error.module.scss';

const FormError = props => {
  const { children, style } = props;
  return (
    <p className={styles['container']} style={style}>
      {' '}
      {children}{' '}
    </p>
  );
};

FormError.propTypes = {
  children: PropTypes.string,
  style: PropTypes.object,
};

FormError.defaultProps = {
  children: '',
  style: {},
};

export default FormError;
