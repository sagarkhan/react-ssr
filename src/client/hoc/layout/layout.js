import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Loader from '../../components/loader/loader';
import styles from './layout.module.scss';
import {
  SESSION,
  AGENT,
  isValidAgent,
  getTimestamp,
} from '../../utils/constants';
import StorageService from '../../services/storage/storage.service';
import environments from '../../environments/environments';
import ErrorHandler from '../../components/error-handler/error-handler';
import ErrorService from '../../services/error-handler/error-handler.service';
import AlertComponent from '../../components/alert/alert';

class Layout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      validUser: false,
      loading: true,
      agent: '',
      alert: {
        visible: false,
        title: '',
        message: '',
        primaryHandler: Function,
        secondaryHandler: Function,
      },
    };
  }

  static getDerivedStateFromProps(props) {
    const { location, history } = props;
    const { pathname } = location;
    if (pathname === '/') {
      history.push('/home');
    }
    return null;
  }

  componentDidMount() {
    this.initalize();
    this.backHandler();
  }

  initalize = () => {
    const agent = StorageService.get(SESSION.AGENT);
    if (agent && Object.values(AGENT).indexOf(agent) > -1) {
      StorageService.set(SESSION.AGENT, agent);
    }
    if (
      window.screen.width < 1080 &&
      agent !== AGENT.ANDROID &&
      agent !== AGENT.IOS
    ) {
      StorageService.set(SESSION.AGENT, AGENT.MOBILE);
    }
    setTimeout(() => {
      this.validateSession();
    }, 1000);
    window.addEventListener('onSessionSet', this.validateSession);
    this.setState({
      agent: StorageService.get(SESSION.AGENT),
    });
  };

  invalidSession = () => {
    this.setState({
      loading: false,
    });
    ErrorService.emit(ErrorService.applicationErrors.invalid_session);
  };

  validSession = () => {
    this.setState({
      validUser: true,
      loading: false,
    });
  };

  validateSession = async () => {
    if (environments.VALIDATE) {
      const remainingTime = getTimestamp(StorageService.get(SESSION.TIMESTAMP));
      if (
        StorageService.get(SESSION.TOKEN) &&
        isValidAgent(StorageService.get(SESSION.AGENT)) &&
        remainingTime > 0
      ) {
        this.validSession();
      } else {
        this.invalidSession();
      }
    } else {
      this.validSession();
    }
  };

  /* Overwrite browser back button */
  backHandler = () => {
    window.addEventListener(
      'onBackPress',
      () => {
        this.setState({
          alert: {
            visible: !window.location.hash,
            title: 'Confirm Action',
            message: 'Are you sure you want to cancel the transaction?',
            primaryHandler: () => {
              /* On back click */
              window.history.go('-2');
            },
            secondaryHandler: () => {
              this.setState({
                alert: {
                  visible: false,
                  title: '',
                  message: '',
                  primaryHandler: Function,
                  secondaryHandler: Function,
                },
              });
            },
          },
        });
      },
      false,
    );
  };

  render() {
    const { children, loader } = this.props;
    const { validUser, loading, alert, agent } = this.state;
    if (loading) {
      return <Loader />;
    }

    return (
      <>
        {validUser && !loading ? (
          <div className={styles['container']}>{children}</div>
        ) : (
          []
        )}
        {loader ? <Loader /> : ''}
        <ErrorHandler agent={agent} />
        {alert.visible ? <AlertComponent {...alert} /> : []}
      </>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.node,
  loader: PropTypes.bool,
  history: PropTypes.object,
  location: PropTypes.object,
};

Layout.defaultProps = {
  children: {},
  loader: false,
  history: {},
  location: {},
};

const mapStateToProps = state => ({
  loader: state.commonReducer.loader,
  error: state.commonReducer.error,
});

export default connect(mapStateToProps)(withRouter(Layout));
