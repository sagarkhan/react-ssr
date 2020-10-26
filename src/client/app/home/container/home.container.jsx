/* eslint-disable react/no-danger */
import React from 'react';
import styles from '../styles/common.module.scss';

export default class HomeContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles['container']}>
        <iframe className={styles['frame']} title="React SSR" src="/instructions.html" />
      </div>
    );
  }
}
