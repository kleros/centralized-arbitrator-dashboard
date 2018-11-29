import './app.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCaretDown, faGavel, faBell, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import Dashboard from './dashboard'

library.add(faGavel)
library.add(faCaretDown)
library.add(faBell)
library.add(faEnvelope)

const App = () => (
  <div className="App">
    <header className="App-header">
      <Dashboard />
    </header>
  </div>
)

export default App
