import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import React from 'react'

class NotificationItem extends React.Component {
  render(){
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-1">
            <label>
              <FontAwesomeIcon icon="check" />
            </label>
          </div>
          <div className="col-xs-9 offset-xs-2">
            <label>This is a notification</label>
          </div>
        </div>
        <div className="row">
        <div className="col-md-6 offset-md-5">
          <sub>5 mins ago</sub>
          </div>
        </div>
      </div>
    )
  }
}

export default NotificationItem
