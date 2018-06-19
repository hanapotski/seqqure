import React from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

const NavItem = props => {
  return (
    <li className={props.hidden ? "hidden" : ""}>
      <NavLink title="Dashboard" to={props.pathTo}>
        <i className={props.icon} />
        <span className="menu-item-parent">{props.name}</span>
      </NavLink>
    </li>
  );
};

export default NavItem;

NavItem.propTypes = {
  pathTo: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

NavItem.defaultProps = {
  icon: "fa fa-lg fa-fw fa-folder"
};
