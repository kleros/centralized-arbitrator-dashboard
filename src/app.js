import React, { Component } from 'react'

import './app.css'
import Dashboard from './dashboard'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Dashboard />
        </header>
      </div>
    )
  }
}

export default App
