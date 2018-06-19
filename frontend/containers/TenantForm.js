import React from "react";
import PropTypes from "prop-types";
import deepmerge from "deepmerge";
import { Link } from "react-router-dom";

// Components
import FormPanel from "../components/FormPanel";
import TenantAdminList from "./TenantAdminList";

// Services
import * as tenantsService from "../services/tenant.service";

// Utilities
import Notifier from "../helpers/notifier";

// Constants
import { ROLE_TA } from "../constants";

// Helpers
import {
  FormField,
  FormFieldConfig,
  validate as formFieldValidate
} from "../helpers/form.helper";

class TenantForm extends React.Component {
  static propTypes = {
    formFields: PropTypes.shape({
      tenantName: PropTypes.string,
      street: PropTypes.string,
      suite: PropTypes.string,
      city: PropTypes.string,
      state: PropTypes.string,
      zip: PropTypes.string,
      slogan: PropTypes.string,
      accountNumber: PropTypes.string,
      subscriptionStatus: PropTypes.string,
      licenseAgency: PropTypes.string,
      licenseType: PropTypes.string,
      licenseNumber: PropTypes.string,
      stripeId: PropTypes.string
    })
  };

  static defaultProps = {
    formFields: {
      tenantName: "",
      street: "",
      suite: "",
      city: "",
      state: "",
      zip: "",
      slogan: "",
      accountNumber: "",
      subscriptionStatus: "",
      licenseAgency: "",
      licenseType: "",
      licenseNumber: "",
      stripeId: ""
    }
  };

  static formDataConfig = {
    tenantName: new FormFieldConfig("Tenant Name", {
      required: { value: true, message: "Tenant Name is required" },
      maxLength: { value: 50 }
    }),
    street: new FormFieldConfig("Street", {
      required: { value: true, message: "Street is required" }
    }),
    suite: new FormFieldConfig("Suite", {
      required: { value: false }
    }),
    city: new FormFieldConfig("City", {
      required: { value: true, message: "City is required" }
    }),
    state: new FormFieldConfig("State", {
      required: { value: true, message: "State is required" }
    }),
    zip: new FormFieldConfig("Zip", {
      required: { value: true, message: "Zip is required" }
    }),
    slogan: new FormFieldConfig("Slogan", {
      required: { value: true, message: "Slogan is required" }
    }),
    accountNumber: new FormFieldConfig("Account Number", {
      required: { value: true, message: "Account Number is required" },
      maxLength: { value: 50 }
    }),
    subscriptionStatus: new FormFieldConfig("Subscription Status", {
      required: { value: true }
    }),
    licenseAgency: new FormFieldConfig("License Agency", {
      required: { value: true, message: "License Agency is required" }
    }),
    licenseType: new FormFieldConfig("License Type", {
      required: { value: true, message: "License Type is required" }
    }),
    licenseNumber: new FormFieldConfig("License Number", {
      required: { value: true, message: "License Number is required" },
      maxLength: { value: 50 }
    }),
    stripeId: new FormFieldConfig("Stripe Id", {
      required: { value: false }
    })
  };

  constructor(props) {
    super(props);

    const activeTenantId = this.props.match
      ? this.props.match.params.tenantId
      : "";
    const formFields = this.createFormFields();

    this.state = {
      formFields: formFields,
      formValid: this.validateForm(formFields),
      activeTenantId: activeTenantId,
      disableSubmit: false,
      showDashboardButton: false
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  createFormFields(tenant) {
    tenant = deepmerge(TenantForm.defaultProps.formFields, tenant || {});

    const formFields = {
      tenantName: new FormField(tenant.tenantName),
      street: new FormField(tenant.street),
      suite: new FormField(tenant.suite),
      city: new FormField(tenant.city),
      state: new FormField(tenant.state),
      zip: new FormField(tenant.zip),
      slogan: new FormField(tenant.slogan),
      accountNumber: new FormField(tenant.accountNumber),
      subscriptionStatus: new FormField(tenant.subscriptionStatus),
      licenseAgency: new FormField(tenant.licenseAgency),
      licenseType: new FormField(tenant.licenseType),
      licenseNumber: new FormField(tenant.licenseNumber),
      stripeId: new FormField(tenant.stripeId)
    };

    for (let fieldName in formFields) {
      let field = formFields[fieldName];
      let config = TenantForm.formDataConfig[fieldName];
      formFieldValidate(field, config);
    }
    return formFields;
  }

  validateForm(formFields) {
    return Object.values(formFields).reduce((valid, formField) => {
      return valid && formField.valid;
    }, true);
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    if (this.state.activeTenantId) {
      tenantsService
        .getTenantById(this.state.activeTenantId)
        .then(data => {
          this.setState({
            formFields: this.createFormFields(data.item)
          });
        })
        .catch(err => {
          Notifier.error("Get tenant by id error", err);
        });
    }
  }

  onChange(e) {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    const name = e.target.name;
    const config = TenantForm.formDataConfig[name];

    this.setState(prevState => {
      const field = { ...prevState.formFields[name] };
      field.value = value;
      field.touched = true;
      formFieldValidate(field, config);

      const formFields = { ...prevState.formFields, [name]: field };
      let formValid = this.validateForm(formFields);
      return { formFields: formFields, formValid: formValid };
    });
  }

  onSubmit(e) {
    e.preventDefault();

    if (!this.state.formValid) {
      const formFields = JSON.parse(JSON.stringify(this.state.formFields));
      for (let field in formFields) {
        formFields[field].touched = true;
      }
      this.setState({ formFields: formFields });
      return;
    }

    const tenant = {
      tenantName: this.state.formFields.tenantName.value,
      street: this.state.formFields.street.value,
      suite: this.state.formFields.suite.value,
      city: this.state.formFields.city.value,
      state: this.state.formFields.state.value,
      zip: this.state.formFields.zip.value,
      slogan: this.state.formFields.slogan.value,
      accountNumber: this.state.formFields.accountNumber.value,
      subscriptionStatus: this.state.formFields.subscriptionStatus.value,
      licenseAgency: this.state.formFields.licenseAgency.value,
      licenseType: this.state.formFields.licenseType.value,
      licenseNumber: this.state.formFields.licenseNumber.value,
      stripeId: this.state.formFields.stripeId.value
    };

    if (this.state.activeTenantId) {
      tenant._id = this.state.activeTenantId;

      tenantsService
        .update(tenant)
        .then(data => {
          Notifier.success(`Successfully updated ${tenant.tenantName}!`);
        })
        .catch(err => {
          Notifier.error("Update tenant error: ", err.message);
        });
    } else {
      this.setState({ disableSubmit: true }, () => {
        tenantsService
          .create(tenant)
          .then(data => {
            Notifier.success(`Successfully created ${tenant.tenantName}`);
            this.setState({
              activeTenantId: data.item,
              disableSubmit: false,
              showDashboardButton: true
            });
          })
          .catch(err => {
            Notifier.error("Post tenant error: ", err.message);
          });
      });
    }
  }

  renderErrorMsgs(field) {
    return !field.valid && field.touched ? (
      <em className="invalid">
        {field.brokenRules.map(br => <div key={br.rule}>{br.msg}</div>)}
      </em>
    ) : null;
  }

  render() {
    const inputClassNames = (inputField, baseClassName = "input") =>
      !inputField.valid && inputField.touched
        ? `${baseClassName} state-error`
        : `${baseClassName}`;

    return (
      <React.Fragment>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6 col-lg-8">
              <FormPanel title="Tenant Form" color="info">
                <form className="smart-form" onSubmit={this.onSubmit}>
                  <header>
                    {this.state.activeTenantId ? "Update Tenant" : "New Tenant"}
                  </header>
                  <fieldset>
                    <section>
                      <label className="label" htmlFor="tenantName">
                        Name
                      </label>
                      <label
                        className={inputClassNames(
                          this.state.formFields.tenantName
                        )}
                      >
                        <i className="icon-append fa fa-user" />
                        <input
                          type="text"
                          name="tenantName"
                          onChange={this.onChange}
                          value={this.state.formFields.tenantName.value}
                        />
                      </label>
                      {this.renderErrorMsgs(this.state.formFields.tenantName)}
                    </section>
                    <section>
                      <label className="label" htmlFor="slogan">
                        Slogan
                      </label>
                      <label
                        className={inputClassNames(
                          this.state.formFields.slogan
                        )}
                      >
                        <i className="icon-append fa fa-bars" />
                        <input
                          type="text"
                          name="slogan"
                          onChange={this.onChange}
                          value={this.state.formFields.slogan.value}
                        />
                      </label>
                      {this.renderErrorMsgs(this.state.formFields.slogan)}
                    </section>
                  </fieldset>
                  <fieldset>
                    <div className="row">
                      <section className="col col-6">
                        <label className="label" htmlFor="street">
                          Street
                        </label>
                        <label
                          className={inputClassNames(
                            this.state.formFields.street
                          )}
                        >
                          <input
                            type="text"
                            name="street"
                            onChange={this.onChange}
                            value={this.state.formFields.street.value}
                          />
                        </label>
                        {this.renderErrorMsgs(this.state.formFields.street)}
                      </section>
                      <section className="col col-6">
                        <label className="label" htmlFor="suite">
                          Suite
                        </label>
                        <label
                          className={inputClassNames(
                            this.state.formFields.suite
                          )}
                        >
                          <input
                            type="text"
                            name="suite"
                            onChange={this.onChange}
                            value={this.state.formFields.suite.value}
                          />
                        </label>
                        {this.renderErrorMsgs(this.state.formFields.suite)}
                      </section>
                    </div>
                    <div className="row">
                      <section className="col col-6">
                        <label className="label" htmlFor="city">
                          City
                        </label>
                        <label
                          className={inputClassNames(
                            this.state.formFields.city
                          )}
                        >
                          <input
                            type="text"
                            name="city"
                            onChange={this.onChange}
                            value={this.state.formFields.city.value}
                          />
                        </label>
                        {this.renderErrorMsgs(this.state.formFields.city)}
                      </section>
                      <section className="col col-3">
                        <label className="label" htmlFor="state">
                          State
                        </label>
                        <label
                          className={inputClassNames(
                            this.state.formFields.state
                          )}
                        >
                          <input
                            type="text"
                            name="state"
                            onChange={this.onChange}
                            value={this.state.formFields.state.value}
                          />
                        </label>
                        {this.renderErrorMsgs(this.state.formFields.state)}
                      </section>
                      <section className="col col-3">
                        <label className="label" htmlFor="zip">
                          Zip
                        </label>
                        <label
                          className={inputClassNames(this.state.formFields.zip)}
                        >
                          <input
                            type="text"
                            name="zip"
                            onChange={this.onChange}
                            value={this.state.formFields.zip.value}
                          />
                        </label>
                        {this.renderErrorMsgs(this.state.formFields.zip)}
                      </section>
                    </div>
                  </fieldset>
                  <fieldset>
                    <div className="row">
                      <section className="col col-6">
                        <label className="label" htmlFor="subscriptionStatus">
                          Subscription Status
                        </label>
                        <label
                          className={inputClassNames(
                            this.state.formFields.subscriptionStatus,
                            "select"
                          )}
                        >
                          <select
                            name="subscriptionStatus"
                            value={
                              this.state.formFields.subscriptionStatus.value
                            }
                            onChange={this.onChange}
                          >
                            <option value="">
                              Choose a subscription status
                            </option>
                            <option value="Pending">Pending</option>
                            <option value="Active">Active</option>
                            <option value="Terminated">Terminated</option>
                          </select>
                          <i />
                        </label>
                        {this.renderErrorMsgs(
                          this.state.formFields.subscriptionStatus
                        )}
                      </section>
                      <section className="col col-6">
                        <label className="label" htmlFor="accountNumber">
                          Account Number
                        </label>
                        <label
                          className={inputClassNames(
                            this.state.formFields.accountNumber
                          )}
                        >
                          <input
                            type="text"
                            name="accountNumber"
                            onChange={this.onChange}
                            value={this.state.formFields.accountNumber.value}
                          />
                        </label>
                        {this.renderErrorMsgs(
                          this.state.formFields.accountNumber
                        )}
                      </section>
                    </div>
                    <div className="row">
                      <section className="col col-6">
                        <label className="label" htmlFor="licenseAgency">
                          License Agency
                        </label>
                        <label
                          className={inputClassNames(
                            this.state.formFields.licenseAgency
                          )}
                        >
                          <input
                            type="text"
                            name="licenseAgency"
                            onChange={this.onChange}
                            value={this.state.formFields.licenseAgency.value}
                          />
                        </label>
                        {this.renderErrorMsgs(
                          this.state.formFields.licenseAgency
                        )}
                      </section>
                      <section className="col col-6">
                        <label className="label" htmlFor="licenseType">
                          License Type
                        </label>
                        <label
                          className={inputClassNames(
                            this.state.formFields.licenseType
                          )}
                        >
                          <input
                            type="text"
                            name="licenseType"
                            onChange={this.onChange}
                            value={this.state.formFields.licenseType.value}
                          />
                        </label>
                        {this.renderErrorMsgs(
                          this.state.formFields.licenseType
                        )}
                      </section>
                    </div>
                    <div className="row">
                      <section className="col col-6">
                        <label className="label" htmlFor="licenseNumber">
                          License Number
                        </label>
                        <label
                          className={inputClassNames(
                            this.state.formFields.licenseNumber
                          )}
                        >
                          <input
                            type="text"
                            name="licenseNumber"
                            onChange={this.onChange}
                            value={this.state.formFields.licenseNumber.value}
                          />
                        </label>
                        {this.renderErrorMsgs(
                          this.state.formFields.licenseNumber
                        )}
                      </section>
                      {this.state.formFields.stripeId.value ? (
                        <section className="col col-6">
                          <label className="label" htmlFor="stripeId">
                            <span onClick={this.onShowModal}>Stripe Id</span>
                          </label>
                          <label
                            className={inputClassNames(
                              this.state.formFields.stripeId
                            )}
                          >
                            <input
                              type="text"
                              name="stripeId"
                              onChange={this.onChange}
                              value={this.state.formFields.stripeId.value}
                            />
                          </label>
                          {this.renderErrorMsgs(this.state.formFields.stripeId)}
                        </section>
                      ) : null}
                    </div>
                  </fieldset>
                  <footer>
                    {!this.props.match ? (
                      <button
                        type="button"
                        className="btn btn-xs btn-warning"
                        onClick={this.props.onHideForm}
                      >
                        Cancel
                      </button>
                    ) : null}
                    <button
                      type="submit"
                      className="btn btn-xs btn-primary"
                      disabled={this.state.disableSubmit}
                    >
                      {this.state.activeTenantId ? "Update" : "Save"}
                    </button>
                    {this.state.showDashboardButton ? (
                      <Link
                        role="button"
                        className="btn btn-success"
                        to={`/tenants/${this.state.activeTenantId}/admins`}
                      >
                        Continue to Dashboard
                      </Link>
                    ) : null}
                  </footer>
                </form>
              </FormPanel>
            </div>
            <div className="col-md-6 col-lg-4">
              <FormPanel title="Administrators" color="info">
                <TenantAdminList
                  roleId={ROLE_TA}
                  tenantId={this.state.activeTenantId}
                  onAdd={this.onAdminAdd}
                  onEdit={this.onAdminEdit}
                  onDelete={this.onAdminDelete}
                />
              </FormPanel>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default TenantForm;
