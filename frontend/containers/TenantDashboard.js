import React from "react";
import { NavLink, Route, Link } from "react-router-dom";
import Spinner from "react-spinkit";

// Components
import FormPanel from "../components/FormPanel";
import PageHeader from "../components/PageHeader";
import Ribbon from "../components/Ribbon";
import TenantSubscription from "../components/TenantSubscription";
import TenantForm from "./TenantForm";
import TenantConfig from "./TenantConfig";

// Services
import { getTenantById } from "../services/tenant.service";

// Utilities
import Notifier from "../helpers/notifier";

class TenantDashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTenantId: this.props.match.params.tenantId,
      tenantInfo: {},
      isLoading: true
    };
    this.onAddStripeId = this.onAddStripeId.bind(this);
  }

  componentWillMount() {
    window.scrollTo(0, 0);
    getTenantById(this.state.activeTenantId)
      .then(response => {
        this.setState({ tenantInfo: response.item, isLoading: false });
      })
      .catch(err => {
        Notifier.error("Get tenant info error");
      });
  }

  onAddStripeId(stripeId) {
    this.setState(prevState => {
      const tenant = { ...prevState.tenantInfo };
      tenant.stripeId = stripeId;
      return {
        tenantInfo: tenant
      };
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
        return "info";
      }
    };

    return (
      <React.Fragment>
        <Ribbon breadcrumbArray={["Tenants", "Tenant Dashboard"]} />
        <div className="container-fluid">
          <PageHeader
            iconClasses="fa fa-fw fa-pencil"
            title="Tenants"
            subtitle="Tenant Dashboard"
          />

          <Link className="btn btn-success mb-2" role="button" to="/tenants">
            <i className="fa fa-lg fa-arrow-left" /> Tenants
          </Link>
          {this.state.isLoading ? (
            <div className="flex-center">
              <Spinner name="ball-spin-fade-loader" />
            </div>
          ) : (
            <FormPanel
              color={panelColor(this.state.tenantInfo.subscriptionStatus)}
            >
              <div className="row">
                <section className="col col-3" />
                <section className="col col-6">
                  <h1 className="text-center">
                    {this.state.tenantInfo.tenantName}
                  </h1>
                </section>
                <ul className="nav nav-tabs bordered">
                  <li>
                    <NavLink
                      className="active"
                      to={`${this.props.match.url}/admins`}
                    >
                      Admins
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="active"
                      to={`${this.props.match.url}/config`}
                    >
                      Config
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="active"
                      to={`${this.props.match.url}/subscription`}
                    >
                      Subscription
                    </NavLink>
                  </li>
                </ul>
                <div className="tab-content padding-10">
                  <div className="tab-pane fade in active">
                    <Route
                      path={`${this.props.match.path}/admins`}
                      component={TenantForm}
                    />
                    <Route
                      path={`${this.props.match.path}/config`}
                      component={TenantConfig}
                    />
                    <Route
                      path={`${this.props.match.path}/subscription`}
                      render={props => (
                        <TenantSubscription
                          {...props}
                          tenantInfo={this.state.tenantInfo}
                          onAddStripeId={this.onAddStripeId}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </FormPanel>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default TenantDashboard;
