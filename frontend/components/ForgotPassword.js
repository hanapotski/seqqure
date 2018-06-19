import React from "react";
import { Modal } from "react-bootstrap";

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      hasBeenValidated: false,
      errorMessage: ""
    };

    this.emailEl = React.createRef();
    this.onChange = this.onChange.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.renderErrorMessage = this.renderErrorMessage.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ email: nextProps.email });
  }

  onChange(e) {
    this.setState(
      {
        email: e.target.value,
        hasBeenValidated: true
      },
      this.validateForm
    );
    console.log(this.state);
  }

  validateForm() {
    this.setState({ errorMessage: this.emailEl.current.validationMessage });
  }

  submitHandler(e) {
    e.preventDefault();
    this.props.onSubmit(e, this.state.email);
  }

  renderErrorMessage() {
    return this.state.hasBeenValidated && this.state.errorMessage ? (
      <em className="invalid">{this.state.errorMessage}</em>
    ) : null;
  }

  render() {
    const { showForgotPasswordModal, handleCloseForgotPassword } = this.props;

    return (
      <Modal show={showForgotPasswordModal} onHide={handleCloseForgotPassword}>
        <Modal.Header closeButton>
          <Modal.Title>Enter your email to reset your password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="smart-form" onSubmit={this.submitHandler} noValidate>
            <fieldset>
              <section>
                <label className="label" htmlFor="email">
                  Email
                </label>
                <label className="input">
                  <input
                    ref={this.emailEl}
                    type="email"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                  />
                </label>
                {this.renderErrorMessage()}
              </section>
            </fieldset>
            <footer>
              <button type="submit" className="btn btn-primary pull-right">
                Send
              </button>
              <button
                type="button"
                className="btn btn-warning pull-right"
                onClick={handleCloseForgotPassword}
              >
                Cancel
              </button>
            </footer>
          </form>
        </Modal.Body>
      </Modal>
    );
  }
}

export default ForgotPassword;
