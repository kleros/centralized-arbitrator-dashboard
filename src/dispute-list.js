import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import React from 'react'

import Dispute from './dispute'

class DisputeList extends React.Component {
  disputes = items =>
    items
      .filter(dispute => dispute.status !== '2')
      .sort(function(a, b) {
        return a.id - b.id
      })
      .map(item => (
        <Dispute
          key={item.id}
          id={item.id}
          arbitrated={item.arbitrated}
          choices={item.choices}
          fee={item.fee}
          status={item.status || '0'}
          metaevidence={item.metaevidence || 'NO META EVIDENCE'}
          evidences={item.evidences}
        />
      ))

  render() {
    const { items } = this.props

    return (
      <div>
        <h1>
          <b>Disputes That Await Your Arbitration</b>
        </h1>

        <table className="table table-hover" id="disputes">
          <thead>
            <tr className="secondary">
              <th>ID</th>
              <th>Arbitrable</th>
              <th>Fee (Ether)</th>
              <th>Status</th>
              <th>
                <FontAwesomeIcon icon="gavel" />
              </th>
            </tr>
          </thead>

          {this.disputes(items)}
        </table>
      </div>
    )
  }
}

DisputeList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default DisputeList
