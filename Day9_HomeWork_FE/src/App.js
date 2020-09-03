import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Modal } from 'react-bootstrap';

export default function () {
  const [username, setUsername] = useState('');
  const [to, setTo] = useState('');
  const [text, setText] = useState('');

  const [show, setShow] = useState(true);

  const [onlineUsers, setOnlineUsers] = useState([]);

  const setUsernameFunction = () => {
    console.log('HERE');
    setShow(!show);
  };

  const sendMessage = () => {};

  return (
    <Container className='container'>
      <Row>
        <Col sm={12} md={6} lg={4} className='users'>
          <div className='heading'>Users</div>
          <div className='usersList'>
            {onlineUsers.map((user) => (
              <div className='user'></div>
            ))}
          </div>
        </Col>
        <Col sm={12} md={6} lg={8} className='chat-box'>
          <div className='messages'>
            <span>Name</span>
            <div></div>
          </div>
          <div className='messagePanel'>
            <input
              type='text'
              onChage={setText}
              placeholder='Write an message!'
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </Col>
      </Row>
      <Modal
        show={show}
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
            onChange={(e) => setUsername(e.currentTarget.value)}
            placeholder='Write your username'
          />
        </Modal.Body>
        <Modal.Footer>
          <button onClick={setUsernameFunction}>Set Username</button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
