import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import styles from './404.module.scss';
import Loader from '../loader/loader';

const NotFound = props => {
  const { delay } = props;
  const [renderComponent, setRenderComponent] = useState(delay ? 1 : 0);
  if (delay) {
    setTimeout(() => {
      setRenderComponent(0);
    }, delay);
  }
  return renderComponent === 0 ? <InvalidRoute /> : <PreLoader />;
};

const InvalidRoute = () => (
  <div className={styles['container']}>
    <div className={styles['container__icon']} />
    <div className={styles['container__content']}>
      <p className={styles['container__content__heading']}>404 Error</p>
      <p className={styles['container__content__subtitle']}>
        We couldn’t find what you are looking for !
      </p>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <Button
          variant="outlined"
          color="primary"
          className={styles['container__content__action']}
        >
          <i className="material-icons"> home </i>
          <span className={styles['container__content__action__actionText']}>
            Go to Home
          </span>
        </Button>
      </Link>
    </div>
  </div>
);

const PreLoader = () => (
  <div className={styles['preloader']}>
    <Loader />
  </div>
);

NotFound.propTypes = {
  delay: PropTypes.number,
};

NotFound.defaultProps = {
  delay: 0,
};

export default memo(NotFound);
