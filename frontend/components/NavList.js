import React from "react";
import PropTypes from "prop-types";

const NavList = props => {
  return (
    <li className={props.hidden ? "active open hidden" : "active open "}>
      <a title="Dashboard">
        <i className={props.icon} />
        <span className="menu-item-parent">{props.name}</span>
      </a>
      <ul style={props.style}>{props.children}</ul>
    </li>
  );
};

NavList.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

NavList.defaultProps = {
  icon: "fa fa-lg fa-fw fa-folder"
};

export default NavList;
