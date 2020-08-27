import React from "react"
import axios from "axios"

class LoginComponent extends React.Component {
  state = {
    email: "",
    password: "",
  }
  render() {
    return (
      <div>
        <input
          type="text"
          value={this.state.email}
          placeholder="email"
          onChange={(val) => this.setState({ email: val.currentTarget.value })}
        ></input>
        <input
          type="password"
          value={this.state.password}
          placeholder="password"
          onChange={(val) =>
            this.setState({ password: val.currentTarget.value })
          }
        ></input>
        <input type="button" onClick={this.login} value="login"></input>
        <a href={`${process.env.REACT_APP_API_URL}/users/googleLogin`}>
          <button>Sign in with Google</button>
        </a>
      </div>
    )
  }

  login = async () => {
    const res = await axios(`${process.env.REACT_APP_API_URL}/users/login`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      data: {
        email: this.state.email,
        password: this.state.password,
      },
      withCredentials: true,
    })

    if (!res.isOk) {
      // display an error
    }
  }
}

export default LoginComponent
