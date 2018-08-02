import React from 'react'
import { Link } from 'react-router-dom'
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap'
import config from '../config'

export default () =>
  <Navbar color="light" light>
    <NavbarBrand className="NavBar__brand" href="/">
      <img className="NavBar__logo" src={`${config.PUBLIC_URL}/assets/alvarcarto-logo-dark.svg`} alt="Alvar Carto" />
    </NavbarBrand>

    <Nav className="NavBar__links mr-auto" navbar>
      <NavItem>
        <NavLink tag={Link} to="/">Promotions</NavLink>
      </NavItem>
    </Nav>
  </Navbar>
