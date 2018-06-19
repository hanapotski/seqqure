import React from "react";
import { Link } from "react-router-dom";

// Services
import { del as deleteTenant } from "../services/tenant.service";

// Utilities
import Notifier from "../helpers/notifier";

class TenantList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: true,
      pending: true,
      terminated: true
    };
    this.onDelete = this.onDelete.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const name = e.target.name;
    const value = e.target.checked;

    this.setState({ [name]: value });
  }

  onDelete(selectedTenant) {
    const that = this;

    deleteTenant(selectedTenant._id)
      .then(data => {
        Notifier.success(`Successfully deleted ${selectedTenant.tenantName}`);
        that.props.onDelete(selectedTenant._id);
      })
      .catch(err => {
        Notifier.error("Delete tenant error", err.message);
      });
  }

  render() {
    const panelColor = status => {
      if (status === "Active") {
        return "info";
      } else if (status === "Terminated") {
        return "danger";
      } else if (status === "Pending") {
        return "warning";
      } else {
        return "primary";
      }
    };

    const { active, pending, terminated } = this.state;

    const Tenants = this.props.tenants
      .filter(tenant => {
        if (active) {
          return tenant;
        } else {
          return (
            tenant.subscriptionStatus === "Pending" ||
            tenant.subscriptionStatus === "Terminated"
          );
        }
      })
      .filter(tenant => {
        if (pending) {
          return tenant;
        } else {
          return (
            tenant.subscriptionStatus === "Active" ||
            tenant.subscriptionStatus === "Terminated"
          );
        }
      })
      .filter(tenant => {
        if (terminated) {
          return tenant;
        } else {
          return (
            tenant.subscriptionStatus === "Active" ||
            tenant.subscriptionStatus === "Pending"
          );
        }
      })
      .map(tenant => (
        <div className="col-sm-6 col-lg-4" key={tenant._id}>
          <div
            className={`panel panel-${panelColor(tenant.subscriptionStatus)}`}
          >
            <div className="panel-heading">
              <h3 className="panel-title">{tenant.subscriptionStatus}</h3>
            </div>

            <div className="panel-body no-padding text-align-center">
              <div className="the-price">
                <Link to={`/tenants/${tenant._id}/admins`}>
                  <h1>{tenant.tenantName}</h1>
                </Link>

                <small className="subscript font-sm">{tenant.slogan}</small>
              </div>
              <table className="table table-striped">
                <tbody>
                  <tr>
                    <td>{tenant.city + ", " + tenant.state}</td>
                  </tr>
                  <tr>
                    <td>{tenant.accountNumber}</td>
                  </tr>
                  <tr>
                    <td>{tenant.licenseAgency}</td>
                  </tr>
                  <tr>
                    <td>{tenant.licenseNumber}</td>
                  </tr>
                  <tr>
                    <td>{tenant.licenseType}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ));

    return (
      <div className="row">
        <div className="mb-2">
          <form className="smart-form checkbox-inline text-primary">
            <label className="checkbox">
              <input
                type="checkbox"
                name="active"
                checked={this.state.active}
                onChange={this.onChange}
              />
              <i /> Active
            </label>
          </form>
          <form className="smart-form checkbox-inline">
            <label className="checkbox">
              <input
                type="checkbox"
                name="pending"
                checked={this.state.pending}
                onChange={this.onChange}
              />
              <i /> Pending
            </label>
          </form>
          <form className="smart-form checkbox-inline">
            <label className="checkbox">
              <input
                type="checkbox"
                name="terminated"
                checked={this.state.terminated}
                onChange={this.onChange}
              />
              <i /> Terminated
            </label>
          </form>
        </div>
        {Tenants}
      </div>
    );
  }
}

export default TenantList;
