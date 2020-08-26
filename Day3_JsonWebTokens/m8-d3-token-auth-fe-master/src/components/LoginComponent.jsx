import React from "react"

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
      </div>
    )
  }

  login = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      }),
    })

    if (res.ok) {
      const json = await res.json()
      localStorage.setItem("accessToken", json.token)
      localStorage.setItem("refreshToken", json.refreshToken)
    }
  }
}

export default LoginComponent
