import React from "react"
import authAxios from "../lib/http"

import Cookies from "js-cookie"
import axios from "axios"

class MainComponent extends React.Component {
  state = { books: [] }
  render() {
    return (
      <>
        {" "}
        <h1>Hi Main</h1>
        <input type="button" onClick={this.getBooks} value="get books"></input>
        <ul>
          {this.state.books.map((book) => (
            <li>{book.title}</li>
          ))}
        </ul>
      </>
    )
  }

  getBooks = async () => {
    try {
      const res = await authAxios.get("/books", { withCredentials: true })
      let books = []

      if (!res) {
        const secondRes = await axios.get("http://localhost:3002/books", {
          headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
          withCredentials: true,
        })
        books = secondRes.data
      } else {
        books = res.data
      }

      this.setState({
        books: books,
      })
    } catch (error) {
      console.log(error)
    }
  }
}

export default MainComponent
