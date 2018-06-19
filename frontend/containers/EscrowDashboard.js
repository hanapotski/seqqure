import React from "react";
import { Route, NavLink, Link } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";
import Spinner from "react-spinkit";

// Components
import Ribbon from "../components/Ribbon";
import FormPanel from "../components/FormPanel";
import PageHeader from "../components/PageHeader";
import EscrowPeople from "../components/EscrowPeople";
import EscrowDocuments from "../components/documents";
import EscrowMessages from "../components/EscrowMessages";
import EscrowMilestones from "../components/EscrowMilestones";
import EscrowEdit from "../components/EscrowEdit";
import EscrowSoi from "../containers/EscrowSoi";
import WireInstructionsIndexEscrow from "../containers/WireInstructionsIndexEscrow";

// Services
import { getById as getEscrowById } from "../services/escrow.service";

// Helpers
import { capitalize } from "../helpers/utilities";

// Constants
import * as constants from "../constants";

class EscrowDashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeEscrow: this.props.match.params.escrowId,
      activeEscrowInfo: {},
      showDashboard: true,
      isLoading: true
    };
    this.editMode = this.editMode.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onAddPerson = this.onAddPerson.bind(this);
    this.onDeletePerson = this.onDeletePerson.bind(this);
    this.onAddRole = this.onAddRole.bind(this);
    this.onEdit = this.onEdit.bind(this);
  }

  componentDidMount() {
    getEscrowById(this.state.activeEscrow).then(response => {
      this.setState({ activeEscrowInfo: response.item, isLoading: false });
    });
  }
  editMode(e) {
    e.preventDefault();
    this.setState({ showDashboard: false });
  }

  onCancel() {
    this.setState({ showDashboard: true });
  }

  onEdit(activeEscrowInfo) {
    this.setState({ activeEscrowInfo });
  }

  onAddPerson(activeEscrowInfo) {
    this.setState({ activeEscrowInfo });
  }

  onDeletePerson(escrowInfo) {
    this.setState({ activeEscrowInfo: escrowInfo });
  }

  onAddRole(escrowInfo) {
    this.setState({ activeEscrowInfo: escrowInfo });
  }

  render() {
    const formattedCloseDate =
      this.state.activeEscrowInfo && this.state.activeEscrowInfo.finalDate ? (
        <React.Fragment>
          {moment(this.state.activeEscrowInfo.finalDate).format("ll")}
          <i className="fa fa-check" />
        </React.Fragment>
      ) : (
        moment(
          this.state.activeEscrowInfo &&
            this.state.activeEscrowInfo.expectedCloseDate
        ).format("ll")
      );

    const buyers =
      this.state.activeEscrowInfo.people &&
      this.state.activeEscrowInfo.people.filter(obj => {
        return obj.securityRole.name === "Buyer";
      });

    const sellers =
      this.state.activeEscrowInfo.people &&
      this.state.activeEscrowInfo.people.filter(obj => {
        return obj.securityRole.name === "Seller";
      });

    const panelColor = status => {
      return status === "active"
        ? "info"
        : status === "closed"
          ? "success"
          : status === "cancelled"
            ? "danger"
            : "info";
    };

    // Get person id of logged in user
    const personId = this.props.loginStatus.person._id;
    //const personRoleCode = this.props.loginStatus.person.code

    // Check if logged in user is escrow manager
    const isEM = this.props.loginStatus.person.roles.includes(
      constants.ROLE_EM
    );

    // Get the role of the logged in user in the escrow
    const personObj =
      this.state.activeEscrowInfo.people &&
      this.state.activeEscrowInfo.people.find(
        personObj => personObj.person && personObj.person._id === personId
      );

    const escrowRole = personObj && personObj.securityRole._id;
    const escrowRoleCode = personObj && personObj.securityRole.code;

    const isEAOrEM = escrowRole === constants.ROLE_EA || isEM;

    const escrowStatus = capitalize(
      this.state.activeEscrowInfo.escrowStatus
        ? this.state.activeEscrowInfo.escrowStatus
        : ""
    );

    const address = ` ${this.state.activeEscrowInfo &&
      this.state.activeEscrowInfo.street}, ${this.state.activeEscrowInfo &&
      this.state.activeEscrowInfo.city}, ${this.state.activeEscrowInfo &&
      this.state.activeEscrowInfo.state} ${this.state.activeEscrowInfo &&
      this.state.activeEscrowInfo.zip}`;

    return (
      <React.Fragment>
        <Ribbon breadcrumbArray={["Escrows", "Escrow Dashboard"]} />

        <div className="container-fluid">
          <PageHeader
            title="Escrows"
            subtitle="Escrow Dashboard"
            iconClasses="fa fa-fw fa-bank"
          />

          <Link role="button" className="btn btn-success mb-2" to="/escrows">
            <i className="fa fa-lg fa-arrow-left" /> Escrows
          </Link>
          {this.state.isLoading ? (
            <div className="flex-center">
              <Spinner name="ball-spin-fade-loader" />
            </div>
          ) : (
            <FormPanel
              title={escrowStatus}
              color={panelColor(this.state.activeEscrowInfo.escrowStatus)}
            >
              {!this.state.showDashboard && (
                <EscrowEdit
                  cancel={this.onCancel}
                  formData={this.state.activeEscrowInfo}
                  onEdit={this.onEdit}
                />
              )}

              {this.state.showDashboard && (
                <div>
                  <div>
                    <p>
                      <span onClick={this.editMode}>
                        <i className="fa fa-fw fa-lg fa-pencil text-primary" />
                        <strong>Escrow #: </strong>
                        {this.state.activeEscrowInfo &&
                          this.state.activeEscrowInfo.escrowNumber}
                      </span>
                      <span className="pull-right">
                        <strong>Closing Date:</strong>
                        {formattedCloseDate}
                      </span>
                    </p>
                    <p>
                      <strong>Property Address: </strong>
                      {address}
                    </p>
                    {buyers &&
                      buyers.map(({ person }, index) => {
                        return person && person.firstName ? (
                          <p key={person._id}>
                            <strong>Buyer: </strong>
                            {`${person.firstName} ${person.lastName}`}
                          </p>
                        ) : (
                          <p key={index}>
                            <strong>Buyer: </strong>
                          </p>
                        );
                      })}
                    {sellers &&
                      sellers.map(({ person }, index) => {
                        return person && person.firstName ? (
                          <p key={person._id}>
                            <strong>Seller: </strong>
                            {`${person.firstName} ${person.lastName}`}
                          </p>
                        ) : (
                          <p key={index}>
                            <strong>Seller: </strong>
                          </p>
                        );
                      })}
                  </div>
                  <br />
                  <hr className="simple" />
                  <ul className="nav nav-tabs bordered">
                    <li>
                      <NavLink
                        activeClassName="active"
                        to={`${this.props.match.url}/people`}
                      >
                        People
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        activeClassName="active"
                        to={`${this.props.match.url}/milestones`}
                      >
                        Milestones
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        activeClassName="active"
                        to={`${this.props.match.url}/documents`}
                      >
                        Documents
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        activeClassName="active"
                        to={`${this.props.match.url}/messages`}
                      >
                        Messages
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        activeClassName="active"
                        to={`${
                          this.props.match.url
                        }/wireInstructionsIndexEscrow`}
                      >
                        Wire Instructions
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        activeClassName="active"
                        to={`${this.props.match.url}/statementOfInfo`}
                      >
                        Statement Of Information
                      </NavLink>
                    </li>
                  </ul>
                  <div className="tab-content">
                    <div className="tab-pane fade in active">
                      <Route
                        path={`${this.props.match.path}/people`}
                        render={props => (
                          <EscrowPeople
                            {...props}
                            escrowInfo={this.state.activeEscrowInfo}
                            onAddPerson={this.onAddPerson}
                            onDeletePerson={this.onDeletePerson}
                            onAddRole={this.onAddRole}
                            isEAOrEM={isEAOrEM}
                          />
                        )}
                      />
                      <Route
                        path={`${this.props.match.path}/documents`}
                        render={props => (
                          <EscrowDocuments
                            {...props}
                            escrowNum={this.state.activeEscrow}
                          />
                        )}
                      />
                      <Route
                        path={`${this.props.match.path}/milestones`}
                        render={props => (
                          <EscrowMilestones
                            escrowNum={this.state.activeEscrow}
                            escrowInfo={this.state.activeEscrowInfo}
                          />
                        )}
                      />
                      <Route
                        path={`${
                          this.props.match.path
                        }/wireInstructionsIndexEscrow`}
                        render={props => (
                          <WireInstructionsIndexEscrow
                            {...props}
                            escrowNumber={this.state.activeEscrowInfo._id}
                            escrowInfo={this.state.activeEscrowInfo}
                            loginStatus={this.props.loginStatus.person.roles}
                            buyers={buyers}
                          />
                        )}
                      />
                      <Route
                        path={`${this.props.match.url}/messages`}
                        render={props => (
                          <EscrowMessages
                            {...props}
                            escrowNum={this.state.activeEscrow}
                            escrowInfo={this.state.activeEscrowInfo}
                            escrowRole={escrowRole}
                            escrowRoleCode={escrowRoleCode}
                          />
                        )}
                      />
                      <Route
                        path={`${this.props.match.path}/statementOfInfo`}
                        render={props => (
                          <EscrowSoi
                            {...props}
                            logRole={this.props.loginStatus.person.roles}
                            personId={personId}
                            escrowPeopleInfo={
                              this.state.activeEscrowInfo.people
                            }
                            escrowId={this.state.activeEscrow}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              )}
            </FormPanel>
          )}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return { loginStatus: state.loginStatus };
};

export default connect(mapStateToProps)(EscrowDashboard);
