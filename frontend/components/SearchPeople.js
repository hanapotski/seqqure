import React from "react";
import { Modal, Button } from "react-bootstrap";
import { AsyncTypeahead } from "react-bootstrap-typeahead";

// Components
import AddPersonModal from "../containers/AddPersonModal";

// Services
import { search } from "../services/escrow.people.service";
import { post as addPerson } from "../services/people.service";
import { sendInvitation } from "../services/inviteService";

// Helpers
import Notifier from "../helpers/notifier";

class SearchPeople extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSelectPersonError: false,
      allowNew: false,
      isLoading: false,
      options: [],
      selectedPerson: null,
      showAddPerson: false
    };
    this.onSearch = this.onSearch.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onAddPerson = this.onAddPerson.bind(this);
    this.handleCloseSearchModal = this.handleCloseSearchModal.bind(this);
    this.handleCloseAddPerson = this.handleCloseAddPerson.bind(this);
    this.handleShowAddPerson = this.handleShowAddPerson.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSearch(query) {
    this.setState({ isLoading: true });
    search(query).then(response => {
      this.setState({
        isLoading: false,
        options: response.item
      });
    });
  }

  onSelect(e) {
    if (e.length !== 0) {
      const person = {
        _id: e[0]._id,
        firstName: e[0].firstName,
        lastName: e[0].lastName
      };
      this.setState({
        selectedPerson: person
      });
    } else {
      this.setState({
        selectedPerson: null
      });
    }
  }

  handleCloseSearchModal() {
    this.setState({ options: [] });
  }

  onAddPerson() {
    if (!this.state.selectedPerson) {
      this.setState({ showSelectPersonError: true });
    } else {
      this.props.onAdd(this.state.selectedPerson);
      this.setState({ options: [] });
      this.props.handleClose();
    }
  }

  handleCloseAddPerson() {
    this.setState({ showAddPerson: false });
  }

  handleShowAddPerson() {
    this.setState({ showAddPerson: true });
    this.props.onHide();
  }

  onSubmit(person) {
    person.roles = [this.props.role._id];
    person.tenantId = this.props.tenantId;

    // Add person
    addPerson(person)
      .then(personData => {
        const invitation = {
          personId: personData.item,
          escrowId: this.props.escrowInfo._id
        };

        // Send Invitation
        sendInvitation(invitation).then(inviteData => {
          Notifier.success(
            `Invitation sent to ${person.firstName} ${person.lastName}`
          );
        });

        // Close modals
        this.setState({ showAddPerson: false });

        // Call on submit on parent component
        const newPerson = {
          _id: personData.item,
          firstName: person.firstName,
          lastName: person.lastName,
          publicEmail: person.publicEmail
        };
        this.props.createPerson(newPerson, this.props.role);
      })
      .catch(err => Notifier.error(err.response.data.errors));
  }

  render() {
    const selectPersonError = this.state.showSelectPersonError ? (
      <p className="note note-error">Search for a person to add.</p>
    ) : null;

    return (
      <React.Fragment>
        <Modal show={this.props.show} onHide={this.props.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Assign a person</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AsyncTypeahead
              {...this.state}
              labelKey={option => `${option.firstName} ${option.lastName}`}
              minLength={3}
              onSearch={this.onSearch}
              onKeyDown={this.onSearch}
              placeholder="Search for a person..."
              menuId="rbt-menu"
              options={this.state.options}
              onChange={this.onSelect}
            />
            {selectPersonError}
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="success" onClick={this.handleShowAddPerson}>
              Invite
            </Button>
            <Button bsStyle="primary" onClick={this.onAddPerson}>
              Assign
            </Button>
            <Button bsStyle="warning" onClick={this.props.onHide}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Add new person modal */}
        <Modal
          show={this.state.showAddPerson}
          onHide={this.handleCloseAddPerson}
        >
          <Modal.Header closeButton>
            <Modal.Title>Assign Person to Role</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AddPersonModal
              onSubmit={this.onSubmit}
              onHide={this.handleCloseAddPerson}
              message={this.state.modalMessage}
            />
          </Modal.Body>
        </Modal>
      </React.Fragment>
    );
  }
}

export default SearchPeople;
