import "./App.css"
import {
  faBell,
  faCaretDown,
  faCheckCircle,
  faEnvelope,
  faGavel,
} from "@fortawesome/free-solid-svg-icons"
import Dashboard from "./Dashboard"
import { library } from "@fortawesome/fontawesome-svg-core"

library.add(faGavel)
library.add(faCaretDown)
library.add(faBell)
library.add(faEnvelope)
library.add(faCheckCircle)

const App = () => (
  <div className="App">
    <header className="App-header">
      <Dashboard />
    </header>
  </div>
)

export default App
