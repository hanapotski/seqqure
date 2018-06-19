import React from "react";
import { withRouter } from "react-router-dom";

// Components
import NavItem from "../components/NavItem";
import NavList from "../components/NavList";
import ContentNav from "../components/contentNav";

// Constants
import * as constants from "../constants";
const bucket = process.env.REACT_APP_S3_PUBLIC;

const MainNav = ({ loggedIn, person, user, history }) => {
  const roles = user ? user.roles : [];

  return (
    //  Note: This width of the aside area can be adjusted through LESS variables
    <aside className={!loggedIn ? "hidden" : ""} id="left-panel">
      {loggedIn && (
        <div className="login-info">
          <span>
            {/* User image size is adjusted inside CSS, it should stay as it */}
            <a
              id="show-shortcut"
              onClick={() =>
                history.push(`/people/${person._id}/dashboard/editPerson`)
              }
            >
              <img
                src={
                  person.fileKey
                    ? `https://${bucket}.s3.amazonaws.com/${person.fileKey}`
                    : "http://www.udayanschoolgor.edu.bd/uploads/avatar_icon.jpg"
                }
                height="65px"
                alt="me"
                className="online"
                style={{
                  borderRadius: "50%"
                }}
              />
              <span>
                {person.firstName
                  ? `${person.firstName} ${person.lastName}`
                  : user.email}
              </span>
            </a>
          </span>
        </div>
      )}
      {/* Add your NavItems/NavLists here */}
      <nav>
        <ul>
          <NavItem
            name="Login"
            pathTo="/login"
            icon="fa fa-lg fa-fw fa-user-circle"
            hidden={loggedIn}
          />
          <NavItem
            name="About Us"
            pathTo="/about"
            icon="fa fa-lg fa-fw fa-user"
            hidden={!loggedIn}
          />
          <ContentNav hidden={!loggedIn} />
          <NavItem
            name="Escrows"
            pathTo="/escrows"
            icon="fa fa-lg fa-fw fa-bank"
            hidden={!loggedIn}
          />
          <NavItem
            name="People"
            pathTo="/people"
            icon="fa fa-lg fa-fw fa-user"
            hidden={
              !roles.includes(constants.ROLE_TA) &&
              !roles.includes(constants.ROLE_MA)
            }
          />
          <NavList
            name="Admin"
            icon="fa fa-lg fa-fw fa-archive"
            hidden={
              !roles.includes(constants.ROLE_TA) &&
              !roles.includes(constants.ROLE_MA)
            }
          >
            <NavItem
              name="Permissions"
              pathTo="/security/admin"
              icon="fa fa-lg fa-fw fa-gear"
            />
            <NavItem
              name="Content Pages"
              pathTo="/contentPages"
              icon="fa fa-lg fa-fw fa-cloud"
            />
            <NavItem
              name="Company"
              pathTo="/companyDashboard/companyForm"
              icon="fa fa-lg fa-fw fa-gear"
            />

            <NavItem
              name="Document Types"
              pathTo="/documentTypes"
              icon="fa fa-lg fa-fw fa-file"
            />
            <NavItem
              name="Milestones"
              pathTo="/milestones"
              icon="fa fa-lg fa-fw fa-road"
            />
            <NavItem
              name="Escrow Templates"
              pathTo="/escrowTemplates"
              icon="fa fa-lg fa-fw fa-anchor"
            />
            <NavItem
              name="Transaction Type"
              pathTo="/transaction"
              icon="fa fa-lg fa-fw fa-gear"
            />
          </NavList>
          <NavList
            name="Master Admin"
            icon="fa fa-lg fa-fw fa-rebel"
            hidden={!roles.includes(constants.ROLE_MA)}
          >
            <NavItem
              name="Tenants"
              pathTo="/tenants"
              icon="fa fa-lg fa-fw fa-gear"
            />
            <NavItem
              name="Security Roles"
              pathTo="/security"
              icon="fa  fa-shield"
            />
            <NavItem
              name="NotificationTypes"
              pathTo="/notificationTypes"
              icon="fa fa-lg fa-fw fa-paper-plane"
            />
            <NavItem
              name="ExceptionsForm"
              pathTo="/exceptionsForm"
              icon="fa fa-lg fa-fw fa-file"
            />
            <NavItem
              name="Edit Faqs"
              pathTo="/faqs"
              icon="fa fa-lg fa-fw fa-file"
            />
          </NavList>

          <NavList
            name="Test"
            icon="fa fa-lg fa-fw fa-folder"
            hidden={
              !roles.includes(constants.ROLE_TA) &&
              !roles.includes(constants.ROLE_MA)
            }
          >
            <NavItem
              name="Account Management"
              pathTo="/accountManagement"
              icon="fa fa-lg fa-fw fa-folder"
            />
            <NavItem
              name="Document List"
              pathTo="/documents"
              icon="fa fa-lg fa-fw fa-cube"
            />
            <NavItem
              name="DropZone Test"
              pathTo="/dropZone"
              icon="fa fa-lg fa-fw fa-cube"
            />
            <NavItem name="Dogs" pathTo="/dogs" icon="fa fa-lg fa-fw fa-paw" />
            <NavItem
              name="Hackers"
              pathTo="/hackers"
              icon="fa fa-lg fa-fw fa-bomb"
            />
            <NavItem
              name="Diagnostics"
              pathTo="/diagnostics"
              icon="fa fa-lg fa-fw fa-bomb"
            />
            <NavItem
              name="React-Table"
              pathTo="/reactTable"
              icon="fa fa-lg fa-fw fa-bomb"
            />
            <NavItem
              name="Bootstrap Testing"
              pathTo="/bootstrapTest"
              icon="fa fa-lg fa-fw fa-rebel"
            />
            <NavItem name=" Map" pathTo="/Maps" icon="fa fa-lg fa-fw fa-map" />
            <NavItem
              name="HTML5 Validation"
              pathTo="/validation"
              icon="fa fa-lg fa-fw fa-check-square-o"
            />
            <NavItem
              name="HigherOrder"
              pathTo="/higher-order"
              icon="fa fa-lg fa-fw fa-free-code-camp"
            />
          </NavList>

          <NavItem
            name="Organization"
            pathTo="/organizations"
            icon="fa fa-sitemap"
          />
          <NavItem
            name="Support Requests"
            pathTo="/supportRequests"
            icon="fa fa-lg fa-fw fa-tag"
            hidden={!loggedIn}
          />
          <NavItem
            name="Faqs"
            pathTo="/readFaqs"
            icon="fa fa-lg fa-fw  fa-question"
            hidden={!loggedIn}
          />
        </ul>
      </nav>

      <span className="minifyme" data-action="minifyMenu">
        <i className="fa fa-arrow-circle-left hit" />
      </span>
    </aside>
  );
};

export default withRouter(MainNav);
