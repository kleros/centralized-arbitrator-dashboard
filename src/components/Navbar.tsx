import $ from "jquery"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Identicon from "./Identicon"
import NotificationItem from "./NotificationItem"
import React, { useEffect, useState } from "react"
import Web3 from "../ethereum/web3"
import { NotificationType } from "../types"

const NavBar = ({
  clearNotifications,
  networkType,
  notifications,
  wallet,
  web3,
}: {
  clearNotifications: () => void
  networkType: string
  notifications: NotificationType[]
  wallet: string
  web3: typeof Web3
}) => {

  //const [allName, setAllName] = useState("")
  //const [allEmail, setAllEmail] = useState("")
  //const [, setAllName] = useState("")
  //const [, setAllEmail] = useState("")
  const [email, setEmail] = useState("")
  const [successful, setSuccessful] = useState(false)

  useEffect(() => {
    $(".notification-control").on("click", () => {
      clearNotifications()
    })
  })

  /*const onAllNameChange = (e: { target: { value: any } }) => {
    console.log(e)
    setAllName(e.target.value)
  }*/

  /*const onAllEmailChange = (e: { target: { value: any } }) => {
    console.log(e)
    setAllEmail(e.target.value)
  }*/

  const onEmailChange = (e: {
    target: { value: React.SetStateAction<string> }
  }) => {
    console.log(e)
    setEmail(e.target.value)
    setSuccessful(false)
  }

  const onSignup = async (email: string) => {
    const address = web3.utils.toChecksumAddress(wallet)
    const settings = {
      centralizedArbitratorDashboardNotificationSettingDisputes: { BOOL: true },
      email: { S: email },
    }
    const signature = await web3.eth.sign(
      JSON.stringify(settings),
      address
    )

    fetch(
      "https://hgyxlve79a.execute-api.us-east-2.amazonaws.com/production/user-settings",
      {
        body: JSON.stringify({
          payload: { address, settings, signature },
        }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      }
    ).then(() => setSuccessful(true))
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <a className="navbar-brand" href="./">
        <span>
          <img
            alt=""
            className="d-inline-block align-mid"
            height="50px"
            src="brand_white.svg"
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
      <div className="collapse navbar-collapse pl-5" id="navbarNav">
        <ul className="navbar-nav mr-auto mb-1">
          <li className="nav-item active">
            <a className="nav-link " href="./">
              <small>Centralized Arbitrator Dashboard</small>
              <span className="sr-only">(current)</span>
            </a>
          </li>
        </ul>
        <div className="dropdown">
          <button
            aria-expanded="false"
            aria-haspopup="true"
            className="btn btn-secondary"
            data-toggle="dropdown"
            id="dropdownMenu2"
            type="button"
          >
            <FontAwesomeIcon className="navbar-icon" icon="bell" size="2x" />
          </button>
          <span className="badge badge-notify primary">
            {notifications.length}
          </span>
          <div
            aria-labelledby="dropdownMenu2"
            className="p-2 dropdown-menu dropdown-menu-right notification-control"
          >
            <div className="m-2 row">
              <div className="col text-center">
                <label>
                  <b>Notifications</b>
                </label>
              </div>
            </div>
            <hr />
            {notifications &&
              notifications.map((notification) => (
                <NotificationItem text={notification.text} time={notification.time} />
              ))}
            {notifications.length === 0 && (
              <div className="text-center">No New Notifications</div>
            )}
          </div>
        </div>
        <div className="mr-4 dropdown">
          <button
            aria-expanded="false"
            aria-haspopup="true"
            className="btn btn-secondary"
            data-toggle="dropdown"
            id="dropdownMenu2"
            type="button"
          >
            <FontAwesomeIcon
              className="navbar-icon"
              icon="envelope"
              size="2x"
            />
          </button>
          <div
            aria-labelledby="dropdownMenu2"
            className="p-4 dropdown-menu dropdown-menu-right email-notification-control"
          >
            <form>
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">E-mail Notifications</label>
                <input
                  aria-describedby="emailHelp"
                  className="form-control"
                  id="exampleInputEmail1"
                  onChange={onEmailChange}
                  placeholder="Enter email"
                  type="email"
                  value={email}
                />
                <small className="form-text text-muted" id="emailHelp">
                  We'll never share your email with anyone else.
                </small>
              </div>
              {!successful && (
                <button
                  className="btn btn-primary"
                  onClick={() => onSignup(email)}
                  type="button"
                >
                  Signup
                </button>
              )}
              {successful && (
                <button className="btn btn-success disabled" type="button">
                  Request Pending
                </button>
              )}
            </form>
            <div className="tab-content" id="myTabContent">
              <div
                aria-labelledby="all-contracts-tab"
                className="tab-pane fade show active"
                id="profile"
                role="tabpanel"
              />
            </div>
          </div>
        </div>
        <div className="align-bottom mx-2 pt-2">
          <Identicon
            bgColor="#4004A3"
            className="identicon rounded-circle"
            color="#009AFF"
            networkType={networkType}
            scale={3}
            seed={wallet}
            size={10}
            spotColor="white"
          />
        </div>
      </div>
    </nav>
  )
}

export default NavBar
