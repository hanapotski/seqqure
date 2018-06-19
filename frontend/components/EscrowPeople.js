import React from "react";
import {
  Modal,
  Button,
  FormGroup,
  ControlLabel,
  FormControl
} from "react-bootstrap";
import { ROLE_EA } from "../constants";

// Components
import SearchPeople from "./SearchPeople";
import EscrowPeopleList from "./EscrowPeopleList";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import PersonCard from "../components/PersonCard";
import EscrowPeopleReadOnly from "../components/EscrowPeopleReadOnly";

// Services
import { editEscrow } from "../services/escrow.service";
import { readAll as readAllSecurityRoles } from "../services/security.service";

// Helpers
import Notifier from "../helpers/notifier";

class EscrowPeople extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showSearch: false,
      showRoles: false,
      securityRoles: [],
      escrowInfo: this.props.escrowInfo,
      selectedRoleObject: null,
      showAddRoleError: false,
      personRole: null,
      index: null,
      showDeleteModal: false,
      selectedPerson: {},
      showPersonCard: false
    };
    this.handleShowSearch = this.handleShowSearch.bind(this);
    this.handleCloseSearch = this.handleCloseSearch.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onAddRole = this.onAddRole.bind(this);
    this.handleCloseRoles = this.handleCloseRoles.bind(this);
    this.onSelectRole = this.onSelectRole.bind(this);
    this.onAddSelectedRole = this.onAddSelectedRole.bind(this);
    this.onAdd = this.onAdd.bind(this);
    this.handleDeleteCancel = this.handleDeleteCancel.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.handleShowPersonCard = this.handleShowPersonCard.bind(this);
    this.handleHidePersonCard = this.handleHidePersonCard.bind(this);
  }
  componentDidMount() {
    readAllSecurityRoles()
      .then(response => {
        const securityRoles = response.items.filter(role => {
          return role.code !== "TA" && role.code !== "MA";
        });
        this.setState({ securityRoles: securityRoles });
      })
      .catch(() => {
        console.log("Get security roles error");
      });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      escrowInfo: nextProps.escrowInfo
    });
  }

  handleCloseSearch() {
    this.setState({ showSearch: false });
  }

  // parameters will come from people list component and will be used to update people array
  handleShowSearch(index, personRole) {
    this.setState({ showSearch: true, index: index, personRole: personRole });
  }

  // This will be called by the search people component
  onAdd(newPerson) {
    const escrowInfo = JSON.parse(JSON.stringify(this.state.escrowInfo));
    for (let person in escrowInfo.people) {
      if (+person === this.state.index) {
        escrowInfo.people[person] = {
          securityRole: this.state.personRole,
          person: newPerson
        };
      }
    }

    const data = {
      escrowInfo,
      personId: newPerson._id
    };

    editEscrow(data).then(response => {
      Notifier.success(`Added ${newPerson.firstName} ${newPerson.lastName}`);
      this.setState({ selectedRole: null });
      this.props.onAddPerson(escrowInfo);
    });
  }

  onDelete() {
    const escrowInfo = JSON.parse(JSON.stringify(this.state.escrowInfo));
    let secRole = "";

    for (let personObject in escrowInfo.people) {
      if (+personObject === this.state.index) {
        secRole = escrowInfo.people[this.state.index].securityRole.name;
        escrowInfo.people.splice(this.state.index, 1);
      }
    }

    const data = {
      escrowInfo,
      personId: null
    };

    editEscrow(data)
      .then(response => {
        Notifier.warning(`Removed ${secRole} from the list.`);
        this.props.onDeletePerson(escrowInfo);
        this.handleDeleteCancel();
        this.setState({ index: null });
      })
      .catch(() => {
        Notifier.error("Delete person error");
      });
  }

  onAddRole() {
    this.setState({
      showRoles: true,
      showAddRoleError: false
    });
  }

  handleCloseRoles() {
    this.setState({ showRoles: false });
  }

  onSelectRole(e) {
    const selectedRoleId = e.target.value;
    const securityRoles = this.state.securityRoles;
    const selectedRole = securityRoles.filter(role => {
      return selectedRoleId === role._id;
    });
    this.setState({ selectedRoleObject: selectedRole[0] });
  }

  onAddSelectedRole() {
    if (!this.state.selectedRoleObject) {
      this.setState({ showAddRoleError: true });
    } else {
      const escrowInfo = JSON.parse(JSON.stringify(this.state.escrowInfo));
      const securityRoleObject = {
        securityRole: {
          _id: this.state.selectedRoleObject._id,
          code: this.state.selectedRoleObject.code,
          name: this.state.selectedRoleObject.name
        }
      };
      escrowInfo.people.push(securityRoleObject);
      const data = { escrowInfo: escrowInfo, personId: null };
      editEscrow(data).then(response => {
        Notifier.success(`Added ${securityRoleObject.securityRole.name}`);
        this.setState({
          showRoles: false,
          selectedRoleObject: null
        });
        this.props.onAddRole(escrowInfo);
      });
    }
  }

  createPerson(newPerson) {
    this.onAdd(newPerson);
  }

  confirmDelete(index) {
    this.setState({ showDeleteModal: true, index: index });
  }

  handleDeleteCancel() {
    this.setState({ showDeleteModal: false });
  }

  handleShowPersonCard(e, person) {
    this.setState({ showPersonCard: true, selectedPerson: person });
  }

  handleHidePersonCard() {
    this.setState({ showPersonCard: false });
  }

  render() {
    const {
      securityRoles,
      personRole,
      showAddRoleError,
      escrowInfo,
      showPersonCard,
      showSearch,
      showRoles,
      showDeleteModal,
      selectedPerson
    } = this.state;

    const Roles =
      securityRoles &&
      securityRoles
        .filter(role => {
          return role._id !== ROLE_EA;
        })
        .map(role => {
          return (
            <option key={role._id} value={role._id}>
              {role.name}
            </option>
          );
        });

    const renderSelectRoleError = showAddRoleError ? (
      <p className="note note-error">Select a role.</p>
    ) : null;

    return (
      <React.Fragment>
        {this.props.isEAOrEM ? (
          <React.Fragment>
            <div className="container-fluid">
              <div className="row">
                <button
                  onClick={this.onAddRole}
                  className="btn btn-primary pull-right addButton"
                >
                  <i className="fa fa-user-plus" />
                  Add new role
                </button>
              </div>
              <div className="row">
                <div className="grid-container">
                  <EscrowPeopleList
                    people={escrowInfo && escrowInfo.people}
                    confirmDelete={this.confirmDelete}
                    handleShowSearch={this.handleShowSearch}
                  />
                </div>
              </div>
            </div>
          </React.Fragment>
        ) : (
          <table
            id="dt_basic"
            className="table table-striped table-bordered table-hover"
            width="100%"
          >
            <thead>
              <tr>
                <th data-class="expand">
                  <i className="fa fa-fw fa-user-secret text-muted hidden-md hidden-sm hidden-xs" />{" "}
                  Role
                </th>
                <th data-class="expand">
                  <i className="fa fa-fw fa-user text-muted hidden-md hidden-sm hidden-xs" />{" "}
                  Name
                </th>
              </tr>
            </thead>
            <tbody>
              <EscrowPeopleReadOnly
                people={escrowInfo && escrowInfo.people}
                handleShowPersonCard={this.handleShowPersonCard}
              />
            </tbody>
          </table>
        )}

        {escrowInfo && (
          <SearchPeople
            role={personRole}
            tenantId={escrowInfo.tenantId}
            show={showSearch}
            handleClose={this.handleCloseSearch}
            onHide={this.handleCloseSearch}
            escrowInfo={escrowInfo}
            onAdd={this.onAdd}
            createPerson={this.createPerson}
          />
        )}

        {/* This will show when the add role button is clicked */}
        <Modal show={showRoles} onHide={this.handleCloseRoles}>
          <Modal.Header closeButton>
            <Modal.Title>Add Role</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormGroup controlId="formControlsSelect">
              <ControlLabel>Roles</ControlLabel>
              <FormControl
                componentClass="select"
                placeholder="select"
                onChange={this.onSelectRole}
              >
                <option>Select Role</option>
                {Roles}
              </FormControl>
            </FormGroup>
            {renderSelectRoleError}
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="success" onClick={this.onAddSelectedRole}>
              Add Role
            </Button>
            <Button bsStyle="warning" onClick={this.handleCloseRoles}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>

        <ConfirmDeleteModal
          show={showDeleteModal}
          message="this role"
          handleDelete={this.onDelete}
          handleDeleteCancel={this.handleDeleteCancel}
        />
        <PersonCard
          personObj={selectedPerson}
          handleHidePersonCard={this.handleHidePersonCard}
          showPersonCard={showPersonCard}
        />
      </React.Fragment>
    );
  }
}

export default EscrowPeople;
