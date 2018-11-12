import React from 'react';
import Dispute from './Dispute'

class Disputes extends React.Component {
  constructor(props) {
    super(props)
  }

  disputes = () => this.props.items.sort().filter(dispute => dispute.status != "10").sort().map((item) => {
    return <Dispute key={item.key} id={item.key} arbitrated={item.arbitrated} choices={item.choices} fee={item.fee} ruling={item.ruling || "0"} status={item.status || "0"} metaevidence={item.metaevidence}/>
  })

  render() {
    return(
      <div>
        <h1>Disputes That Await Your Arbitration</h1>

        <table className="table table-hover" id="disputes">
          <thead>
            <tr>
              <th>ID</th>
              <th>Arbitrable</th>
              <th>Fee (Finney)</th>
              <th>Ruling</th>
              <th>Status</th>
            </tr>
          </thead>

            {this.disputes()}
        </table>

      </div>
    )
  }
}

export default Disputes
