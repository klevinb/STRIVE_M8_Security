import React from "react"
import "./App.css"

import Main from "./components/MainComponent"

class App extends React.Component {
  state = { authOk: true }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Main></Main>
          {/* <Router>
          <Route path="/login" component={Login} />
          <Route path="/" component={Main} exact />
        </Router> */}
        </header>
      </div>
    )
  }

  setToken = (token) => {
    this.setState({
      token: token,
      authOk: true,
    })
  }
}

export default App
