import './app.css'
import {
  faBell,
  faCaretDown,
  faEnvelope,
  faGavel
} from '@fortawesome/free-solid-svg-icons'
import Dashboard from './dashboard'
import React from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'

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
