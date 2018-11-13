import React from 'react'

class DisputeDetail extends React.Component {


  render() {
    return (
      <div>

        <h4>{"Category: " + this.props.category}</h4>
        <h4>{"File URI: " + this.props.fileURI}</h4>
        <h4>{"File Hash: " + this.props.fileHash}</h4>
        <h4>{"Title: " + this.props.title}</h4>
        <h4>{"Description: " + this.props.description}</h4>
        <h4>{"Question: " + this.props.question}</h4>
        <div className="dropdown">
          <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Rule
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a className="dropdown-item" href="#">Action</a>
            <a className="dropdown-item" href="#">Another action</a>
            <a className="dropdown-item" href="#">Something else here</a>
          </div>
        </div>
      </div>
    )
  }
}

export default DisputeDetail
