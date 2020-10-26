import React, { PureComponent } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ErrorService from '../../services/error-handler/error-handler.service';

class ErrorHandler extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      message: '',
      title: '',
      handler: this.handleClose,
    };
  }

  componentDidMount() {
    ErrorService.activate().subscribe(error => {
      this.setState({
        visible: true,
        ...error,
      });
    });
  }

  handleClickOpen = () => {
    this.setState({
      visible: true,
    });
  };

  handleClose = () => {
    this.setState({
      visible: false,
      message: '',
      title: '',
    });
  };

  render() {
    const { visible, title, message, handler } = this.state;
    return (
      <Dialog open={visible}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handler} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default ErrorHandler;
