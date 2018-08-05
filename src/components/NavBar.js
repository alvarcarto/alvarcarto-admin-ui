import React, { Component } from 'react'
import _ from 'lodash'
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  UncontrolledDropdown,
} from 'reactstrap'
import { getMe } from '../util/api'
import config from '../config'

class NavBar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: null,
    }
  }

  componentDidMount() {
    getMe()
      .then((res) => {
        this.setState({
          user: res.data,
          loading: false,
        })
      })
      .catch((err) => {
        this.setState({ loading: false })

        alert('Error fetching user details')
        throw err
      })
  }

  render() {
    return <Navbar className="NavBar" color="light" light>
      <NavbarBrand className="NavBar__brand" href="/">
        <img className="NavBar__logo" src={`${config.PUBLIC_URL}/assets/alvarcarto-logo-dark.svg`} alt="Alvar Carto" />
      </NavbarBrand>

      <Nav className="NavBar__links" navbar>
        <UncontrolledDropdown className="NavBar__name" nav>
          <DropdownToggle nav caret>
            {_.get(this.state, 'user.name', 'Name').split(' ')[0]}
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem>
            <a href="/logout">Log out</a>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
        <NavItem>
          <img className="NavBar__profile-image" src={_.get(this.state, 'user.photoUrl', null)} alt="" />
        </NavItem>
      </Nav>

    </Navbar>
  }
}

export default NavBar

