import React from "react"
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom"
import LoginComponent from "./LoginComponent"
import Books from "./BooksComponent"

class MainComponent extends React.Component {
  render() {
    return (
      <Router>
        <h1> Welcome to our app!</h1>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <Link to="/login">Login</Link>
          <Link to="/books">Books</Link>
        </div>
        <Switch>
          <Route path="/login">
            <LoginComponent />
          </Route>
          <Route path="/books">
            <Books />
          </Route>
        </Switch>
      </Router>
    )
  }
}

export default MainComponent
