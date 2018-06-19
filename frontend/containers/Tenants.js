import React from "react";

// Components
import PageHeader from "../components/PageHeader";
import Ribbon from "../components/Ribbon";
import TenantList from "../components/TenantList";
import FormPanel from "../components/FormPanel";

// Services
import * as tenantsService from "../services/tenant.service";

// Helpers
import Notifier from "../helpers/notifier";
import TenantForm from "./TenantForm";

class Tenants extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tenants: [],
      showForm: false,
      showAddButton: true
    };

    this.onDelete = this.onDelete.bind(this);
    this.onShowForm = this.onShowForm.bind(this);
    this.onHideForm = this.onHideForm.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    tenantsService
      .readAll()
      .then(data => {
        this.setState({
          tenants: data.items
        });
      })
      .catch(err => {
        Notifier.error("Get tenants error: ", err.message);
      });
  }

  onDelete(id) {
    this.setState(prevState => {
      const newTenants = prevState.tenants.filter(tenant => tenant._id !== id);
      return { tenants: newTenants };
    });
  }

  onShowForm() {
    this.setState({ showForm: true, showAddButton: false });
  }

  onHideForm() {
    this.setState({ showForm: false, showAddButton: true });
  }

  render() {
    return (
      <React.Fragment>
        <Ribbon breadcrumbArray={["Master", "Tenants"]} />
        <PageHeader
          iconClasses="fa fa-lg fa-fw fa-gear"
          title="Tenants"
          subtitle="SeQQure Tenants"
        />

        <div className="container-fluid">
          <div className="col-lg-12">
            {this.state.showAddButton ? (
              <div className="row">
                <button
                  className="btn btn-primary btn-xs pull-right"
                  onClick={this.onShowForm}
                >
                  Add new
                </button>
              </div>
            ) : null}
            <div className="row">
              <FormPanel>
                <div className="pl-3 pr-3">
                  {!this.state.showForm ? (
                    <TenantList
                      onDelete={this.onDelete}
                      tenants={this.state.tenants}
                    />
                  ) : (
                    <TenantForm onHideForm={this.onHideForm} />
                  )}
                </div>
              </FormPanel>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Tenants;
