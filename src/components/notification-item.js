import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import React from 'react'
import TimeAgo from 'react-timeago'

class NotificationItem extends React.Component {
  render() {
    const { text, time } = this.props

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
            <label>{this.props.text}</label>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <sub className="float-right primary-inverted">
              <b>
                <TimeAgo
                  date={this.props.time}
                  maxPeriod={3600}
                  minPeriod={5}
                />
              </b>
            </sub>
          </div>
        </div>
        <hr />
      </div>
    )
  }
}

export default NotificationItem
