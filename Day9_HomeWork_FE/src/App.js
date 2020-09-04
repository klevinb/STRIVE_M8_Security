import React, { useState, useEffect, Component } from 'react';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import io from 'socket.io-client';

export default class App extends Component {
  socket = null;

  state = {
    show: true,
    username: '',
    to: '',
    text: '',
    onlineUsers: [],
    messages: [],
  };

  componentDidMount = () => {
    const connectionOpt = {
      transports: ['websocket'],
    };
    this.socket = io('http://localhost:3432', connectionOpt);
    this.socket.on('online', (data) => {
      this.setState({ onlineUsers: data });
    });
    this.socket.on('message', (data) => {
      const messages = this.state.messages;
      messages.push(data);
      this.setState({ messages });
    });
  };

  setUsernameFunction = () => {
    this.socket.emit('setUsername', {
      username: this.state.username,
    });
    this.setState({
      show: !this.state.show,
    });
  };

  sendMessage = () => {
    if (this.state.text.length > 1 && this.state.to.length > 1) {
      this.socket.emit('sendMessage', {
        from: this.state.username,
        to: this.state.to,
        text: this.state.text,
      });

      this.setState({
        messages: [
          ...this.state.messages,
          {
            from: this.state.username,
            to: this.state.to,
            text: this.state.text,
          },
        ],
        text: '',
      });
    }
  };

  render() {
    return (
      <Container className='container'>
        <Row>
          <Col sm={12} md={6} lg={4} className='users'>
            <div className='heading'>Users</div>
            <div className='usersList'>
              {this.state.onlineUsers
                .filter((usr) => usr !== this.state.username)
                .map((user) => (
                  <div
                    key={user}
                    className={
                      this.state.to === user ? 'user selected' : 'user'
                    }
                    onClick={() => this.setState({ to: user })}
                  >
                    {user}
                  </div>
                ))}
            </div>
          </Col>
          <Col sm={12} md={6} lg={8} className='chat-box'>
            <div className='messages'>
              <ul>
                {this.state.messages.map((msg) => (
                  <li
                    className={
                      this.state.username === msg.from
                        ? 'text-right'
                        : 'text-left'
                    }
                  >
                    {msg.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className='messagePanel'>
              <input
                type='text'
                value={this.state.text}
                onChange={(e) => this.setState({ text: e.currentTarget.value })}
                placeholder='Write an message!'
              />
              <button onClick={() => this.sendMessage()}>Send</button>
            </div>
          </Col>
        </Row>
        <Modal
          show={this.state.show}
          onHide={() => {
            alert('Please choose an username');
          }}
        >
          <Modal.Header>
            <h1>Select your username</h1>
          </Modal.Header>
          <Modal.Body>
            <input
              type='text'
              onChange={(e) =>
                this.setState({ username: e.currentTarget.value })
              }
              placeholder='Write your username'
            />
          </Modal.Body>
          <Modal.Footer>
            <button onClick={this.setUsernameFunction}>Set Username</button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }
}
