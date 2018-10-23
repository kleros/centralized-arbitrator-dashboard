import React from 'react';
import Dispute from './Dispute'

class Disputes extends React.Component {
  constructor(props) {
    super(props)
  }

  disputes = () => this.props.items.sort().filter(dispute => dispute.status == "0").map((item) => {
    return <Dispute key={item.key} id={item.key} arbitrated={item.arbitrated} choices={item.choices} fee={item.fee} ruling={item.ruling || "0"} status={item.status || "0"}/>
  })

  render() {
    return(
      <div>
        <h1>Disputes That Await Your Arbitration</h1>

        <table>
          <tbody>
            <tr>
              <th>ID</th>
              <th>Arbitrated</th>
              <th>Choices</th>
              <th>Fee(ETH)</th>
              <th>Ruling</th>
              <th>Status</th>
            </tr>
            {this.disputes()}
          </tbody>
        </table>
      </div>
    )
  }
}

export default Disputes
