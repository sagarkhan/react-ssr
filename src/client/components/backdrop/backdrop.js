/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React from 'react';
import styles from './backdrop.module.scss';

const Backdrop = props => (
  <div className={styles.container}> {props.children} </div>
);

export default Backdrop;
