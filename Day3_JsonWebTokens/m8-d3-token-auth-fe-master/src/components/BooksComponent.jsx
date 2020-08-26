import React from "react"
import authAxios from "../lib/http"

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
    const res = await authAxios.get("/books")
    const books = res.data

    this.setState({
      books,
    })
  }
}

export default MainComponent
