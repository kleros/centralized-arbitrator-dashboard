import PropTypes from 'prop-types'
import React from 'react'

import Identicon from './identicon.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class NavBar extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {}

  componentDidUpdate() {}

  render() {
    const { wallet } = this.props
    return (
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-dark">
          <a className="navbar-brand" href="#">
            <span>
              <img
                src="kleros-logo.svg"
                width="30"
                height="30"
                alt=""
                className="d-inline-block align-top"
              />
            </span>
            <span>KLEROS</span>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
              <li className="nav-item active">
                <a className="nav-link" href="#">
                  Centralized Arbitrator Dashboard
                  <span className="sr-only">(current)</span>
                </a>
              </li>
            </ul>
            <div className="mx-2 my-lg-0 icon-grey badge">
              <FontAwesomeIcon icon="bell" className="navbar-icon" />
            </div>
            <div className="mx-2 my-lg-0">
              <FontAwesomeIcon icon="envelope" className="navbar-icon" />
            </div>
            <div className="mx-2 my-lg-0">
              <Identicon
                bgColor="#4004A3"
                className="identicon"
                color="#009AFF"
                scale={3}
                seed={wallet}
                size={10}
                spotColor="white"/>
            </div>
          </div>
        </nav>
      </div>
    )
  }
}

export default NavBar
