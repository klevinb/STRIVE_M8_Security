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

  /*

  componentDidMount = async () => {
    var token = localStorage.getItem("token")
    if (token) {
      var res = await fetch("http://localhost:3333/users/refresh", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        method: "POST",
      })
      if (res.ok) {
        var json = await res.json()
        localStorage.setItem("token", json.token)
        // return <Redirect to='/target' />

        this.setState({
          token: json.token,
          authOk: true,
        })
      } else {
        this.setState({
          authOk: false,
        })
        // return <Redirect to='/login' />
      }
    } else {
      // return <Redirect to='/login' />
      this.setState({
        authOk: false,
      })
    }
  } */
}

export default App
