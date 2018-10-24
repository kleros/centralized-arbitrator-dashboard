import React from 'react';
import Dispute from './Dispute'

class Disputes extends React.Component {
  constructor(props) {
    super(props)
  }

  disputes = () => this.props.items.sort().filter(dispute => dispute.status == "0").sort().map((item) => {
    return <Dispute key={item.key} id={item.key} arbitrated={item.arbitrated} choices={item.choices} fee={item.fee} ruling={item.ruling || "0"} status={item.status || "0"}/>
  })

  render() {
    return(
      <div>
        <h1>Disputes That Await Your Arbitration</h1>

        <div className="accordion" id="accordionExample">
          {this.disputes()}
        </div>

      </div>
    )
  }
}

export default Disputes
