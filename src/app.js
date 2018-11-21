import React from 'react'

import './app.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGavel, faCaretDown } from '@fortawesome/free-solid-svg-icons'

import Dashboard from './dashboard'

library.add(faGavel)
library.add(faCaretDown)

const App = () => (
  <div className="App">
    <header className="App-header">
      <Dashboard />
    </header>
  </div>
)

export default App
