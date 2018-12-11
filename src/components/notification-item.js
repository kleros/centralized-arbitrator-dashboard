import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import React from 'react'

class NotificationItem extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-1">
            <label>
              <FontAwesomeIcon
                className="primary-inverted"
                icon="check-circle"
              />
            </label>
          </div>
          <div className="col-8">
            <label>This is a notification</label>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <sub className="float-right primary-inverted">
              <b>5 mins ago</b>
            </sub>
          </div>
        </div>
        <hr />
      </div>
    )
  }
}

export default NotificationItem
