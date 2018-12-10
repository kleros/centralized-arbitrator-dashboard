import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Identicon from './identicon.js'
import PropTypes from 'prop-types'
import React from 'react'

class NavBar extends React.Component {
  componentDidMount() {}

  componentDidUpdate() {}

  render() {
    const { wallet } = this.props
    return (
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-dark">
          <a className="navbar-brand" href="./">
            <span>
              <img
                alt=""
                className="d-inline-block align-mid"
                height="30"
                src="kleros-logo.svg"
                width="30"
              />
            </span>{' '}
            <span>
              <img
                alt=""
                className="d-inline-block align-mid"
                height="auto"
                src="Group.svg"
                width="auto"
              />
            </span>
          </a>
          <button
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            className="navbar-toggler"
            data-target="#navbarNav"
            data-toggle="collapse"
            type="button"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
              <li className="nav-item active">
                <a className="nav-link" href="./">
                  Centralized Arbitrator Dashboard
                  <span className="sr-only">(current)</span>
                </a>
              </li>
            </ul>
            <div class="dropdown">
              <button
                aria-expanded="false"
                aria-haspopup="true"
                class="btn btn-secondary"
                data-toggle="dropdown"
                id="dropdownMenu2"
                type="button"
              >
                <FontAwesomeIcon
                  className="navbar-icon"
                  icon="bell"
                  onClick={e => e.stopPropagation()}
                />
              </button>
              <div aria-labelledby="dropdownMenu2" class="dropdown-menu">
                <button class="dropdown-item" type="button">
                  Action
                </button>
                <button class="dropdown-item" type="button">
                  Another action
                </button>
                <button class="dropdown-item" type="button">
                  Something else here
                </button>
              </div>
            </div>
            <div class="mx-2 dropdown" onClick={e => e.stopPropagation()}>
              <button
                aria-expanded="false"
                aria-haspopup="true"
                class="btn btn-secondary"
                data-toggle="dropdown"
                id="dropdownMenu2"
                type="button"
              >
                <FontAwesomeIcon className="navbar-icon" icon="envelope" />
              </button>
              <div
                aria-labelledby="dropdownMenu2"
                class="p-4 dropdown-menu dropdown-menu-right"
                onClick={e => e.stopPropagation()}
              >
                <label>Register to receive notifications by email</label>
                <hr />
                <ul
                  class="nav nav-tabs email-control"
                  id="myTab"
                  role="tablist"
                >
                  <li class="nav-item">
                    <a
                      aria-controls="profile"
                      aria-selected="true"
                      class="nav-link active"
                      data-toggle="tab"
                      href="#profile"
                      id="all-contracts-tab"
                      role="tab"
                      onClick={e => e.stopPropagation()}
                    >
                      All Contracts
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      aria-controls="contact"
                      aria-selected="false"
                      class="nav-link"
                      data-toggle="tab"
                      href="#contact"
                      id="current-contract-tab"
                      role="tab"
                    >
                      Current Contract
                    </a>
                  </li>
                </ul>
                <div class="tab-content" id="myTabContent">
                  <div
                    aria-labelledby="all-contracts-tab"
                    class="tab-pane fade show active"
                    id="profile"
                    role="tabpanel"
                  >
                    <label>Send me an email:</label>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        id="defaultCheck1"
                        type="checkbox"
                        value=""
                      />
                      <label class="form-check-label" for="defaultCheck1">
                        When there is a new dispute
                      </label>
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        id="defaultCheck2"
                        type="checkbox"
                        value=""
                      />
                      <label class="form-check-label" for="defaultCheck2">
                        When there is a new evidence to an existing dispute
                      </label>
                    </div>
                    <hr />
                    <form>
                      <div class="form-group row">
                        <div class="col-sm-12">
                          <input
                            class="form-control"
                            id="inputEmail3"
                            placeholder="Name"
                            type="email"
                          />
                        </div>
                      </div>
                      <div class="form-group row">
                        <div class="col-sm-12">
                          <input
                            class="form-control"
                            id="inputPassword3"
                            placeholder="Email"
                            type="password"
                          />
                        </div>
                      </div>

                      <div class="form-group row">
                        <div class="col-sm-6">
                          <button class="btn" type="submit">
                            Unsubscribe
                          </button>
                        </div>
                        <div class="col-sm-6">
                          <button
                            class="btn btn-primary float-right"
                            type="submit"
                          >
                            Subscribe
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div
                    aria-labelledby="current-contract-tab"
                    class="tab-pane fade"
                    id="contact"
                    role="tabpanel"
                  >
                    hi there
                  </div>
                </div>
              </div>
            </div>

            <div className="button">
              <Identicon
                bgColor="#4004A3"
                className="identicon"
                color="#009AFF"
                scale={3}
                seed={wallet}
                size={10}
                spotColor="white"
              />
            </div>
          </div>
        </nav>
      </div>
    )
  }
}

NavBar.propTypes = {
  wallet: PropTypes.string.isRequired
}

export default NavBar
