import React from 'react';
import MenuItem from 'app/shared/layout/menus/menu-item';
import { DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { NavLink as Link } from 'react-router-dom';
import { NavDropdown } from './menu-components';

export const EntitiesMenu = props => (
  <NavDropdown icon="th-list" name="Entities" id="entity-menu" style={{ maxHeight: '80vh', overflow: 'auto' }}>
    <MenuItem icon="asterisk" to="/customer-token">
      Customer Token
    </MenuItem>
    <MenuItem icon="asterisk" to="/promotion">
      Promotion
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-attribute">
      Tbl Attribute
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-attribute-map">
      Tbl Attribute Map
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-attribute-value">
      Tbl Attribute Value
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-bill">
      Tbl Bill
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-city">
      Tbl City
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-codlog">
      Tbl Codlog
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-customer">
      Tbl Customer
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-customer-advisory">
      Tbl Customer Advisory
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-customer-call">
      Tbl Customer Call
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-customer-category">
      Tbl Customer Category
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-customer-map">
      Tbl Customer Map
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-customer-request">
      Tbl Customer Request
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-customer-skin">
      Tbl Customer Skin
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-customer-status">
      Tbl Customer Status
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-customer-temp">
      Tbl Customer Temp
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-customer-type">
      Tbl Customer Type
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-district">
      Tbl District
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-fanpage">
      Tbl Fanpage
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-migration">
      Tbl Migration
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-order">
      Tbl Order
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-order-details">
      Tbl Order Details
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-order-push">
      Tbl Order Push
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-product">
      Tbl Product
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-product-details">
      Tbl Product Details
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-product-group">
      Tbl Product Group
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-product-group-map">
      Tbl Product Group Map
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-product-quantity">
      Tbl Product Quantity
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-promotion-customer-level">
      Tbl Promotion Customer Level
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-promotion-item">
      Tbl Promotion Item
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-receipt">
      Tbl Receipt
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-report-customer-category-date">
      Tbl Report Customer Category Date
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-report-date">
      Tbl Report Date
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-site">
      Tbl Site
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-site-map-domain">
      Tbl Site Map Domain
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-store">
      Tbl Store
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-store-input">
      Tbl Store Input
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-store-input-details">
      Tbl Store Input Details
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-transaction">
      Tbl Transaction
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-transport">
      Tbl Transport
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-transport-log">
      Tbl Transport Log
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-user">
      Tbl User
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-user-device-token">
      Tbl User Device Token
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-user-notify">
      Tbl User Notify
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-user-role">
      Tbl User Role
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-user-team">
      Tbl User Team
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-user-type">
      Tbl User Type
    </MenuItem>
    <MenuItem icon="asterisk" to="/tbl-wards">
      Tbl Wards
    </MenuItem>
    <MenuItem icon="asterisk" to="/user-token">
      User Token
    </MenuItem>
    {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
  </NavDropdown>
);
