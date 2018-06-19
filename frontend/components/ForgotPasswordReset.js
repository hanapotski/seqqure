import React from "react";

// Components
import Ribbon from "./Ribbon";
import FormPanel from "./FormPanel";

// Services
import { forgotPasswordReset, resetPassword } from "../services/userService";

// Utilities
import Notifier from "../helpers/notifier";

class ForgotPasswordReset extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {
        password: "",
        cPassword: ""
      },
      hasBeenValidated: {
        password: false,
        cPassword: false
      },
      errorMessages: {},
      resetToken: this.props.match.params.token,
      showForm: false
    };

    this.formEl = React.createRef();
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.renderClassNames = this.renderClassNames.bind(this);
    this.renderErrorMessages = this.renderErrorMessages.bind(this);
  }

  componentDidMount() {
    forgotPasswordReset(this.state.resetToken)
      .then(response => {
        this.setState({ showForm: true });
      })
      .catch(err => {
        Notifier.error("This link has expired.");
        this.props.history.push("/login");
      });
  }

  onChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    this.setState(prevState => {
      const formData = { ...prevState.formData, [name]: value };
      const hasBeenValidated = { ...prevState.hasBeenValidated, [name]: true };
      return { formData, hasBeenValidated };
    }, this.validateForm);
  }

  validateForm() {
    this.customValidation();
    this.setErrorMessages();
  }

  customValidation() {
    const formEl = this.formEl.current;
    let passwordValue;
    for (let input of formEl) {
      if (input.name === "password") {
        input.setCustomValidity(
          input.validity.patternMismatch
            ? "Password must be at least 6 characters long and contain one number"
            : ""
        );
        passwordValue = input.value;
      }

      if (input.name === "cPassword") {
        input.setCustomValidity(
          input.value !== passwordValue
            ? "Passwords must match"
            : input.validity.patternMismatch
              ? "Password must be at least 6 characters long and contain one number"
              : ""
        );
      }
    }
  }

  onSubmit(e) {
    e.preventDefault();

    if (this.formEl.current.checkValidity()) {
      const data = {
        password: this.state.formData.password,
        token: this.props.match.params.token
      };

      resetPassword(data)
        .then(() => {
          Notifier.success(
            "Reset password successful. Please login with your new password."
          );
          this.props.history.push("/login");
        })
        .catch(err => {
          console.log(err.response);
        });
    }

    this.validateForm();
    this.setState({ hasBeenValidated: { password: true, cPassword: true } });
  }

  setErrorMessages() {
    const errorMessages = {};
    const formEl = this.formEl.current;

    for (let input of formEl) {
      if (input.name) {
        errorMessages[input.name] = input.validationMessage;
      }
    }
    this.setState({ errorMessages });
  }

  renderClassNames(inputName) {
    return this.state.hasBeenValidated[inputName] &&
      this.state.errorMessages[inputName]
      ? "input state-error"
      : "input";
  }

  renderErrorMessages(inputName) {
    return this.state.hasBeenValidated[inputName] &&
      this.state.errorMessages[inputName] ? (
      <em className="invalid">{this.state.errorMessages[inputName]}</em>
    ) : null;
  }

  render() {
    return (
      <React.Fragment>
        <Ribbon breadcrumbArray={["Reset Password"]} />
        {this.state.showForm && (
          <div className="row">
            <div className="col-sm-offset-3 col-sm-6">
              <FormPanel title="Password Reset">
                <form
                  style={{ marginLeft: "13%" }}
                  ref={this.formEl}
                  noValidate
                  className="smart-form"
                  onSubmit={this.onSubmit}
                >
                  <fieldset>
                    <div className="row">
                      <section className="col col-10">
                        <label className="label" htmlFor="password">
                          <strong>New Password</strong>{" "}
                        </label>
                        <label className={this.renderClassNames("password")}>
                          <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            autoComplete="new-password"
                            value={this.state.formData.password}
                            onChange={this.onChange}
                            required
                            pattern="^(?=.*[0-9]).{6,}$"
                          />
                        </label>
                        {this.renderErrorMessages("password")}
                        <br />
                        <label className="label" htmlFor="cPassword">
                          <strong>Confirm Password</strong>{" "}
                        </label>
                        <label className={this.renderClassNames("cPassword")}>
                          <input
                            type="password"
                            name="cPassword"
                            placeholder="Confirm Password"
                            autoComplete="new-password"
                            value={this.state.formData.cPassword}
                            onChange={this.onChange}
                            required
                            pattern="^(?=.*[0-9]).{6,}$"
                          />
                        </label>
                        {this.renderErrorMessages("cPassword")} <br />
                        <button
                          className="form-control btn btn-primary btn-block"
                          type="submit"
                        >
                          Update Password
                        </button>
                      </section>
                    </div>
                  </fieldset>
                </form>
              </FormPanel>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default ForgotPasswordReset;
