import React, { useState } from 'react';
import { Container, Image, Button, FormControl, Form } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';

function LoginComponent(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    const resp = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
      method: 'POST',
      credentials: 'include', // Don't forget to specify this if you need cookies
      headers: headers,
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (resp.ok) {
      props.history.push('/selectCities');
    }

    if (!resp.isOk) {
      // display an error
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login();
  };
  return (
    <>
      <Container>
        <div className='loginContent d-flex flex-column'>
          <span>To continue, log in to WeatherApp.</span>
          <Button
            id='facebookBtn'
            onClick={() =>
              alert(
                "We haven't implemented this feature yet, you can log in with your credentials"
              )
            }
          >
            CONTINUE WITH FACEBOOK
          </Button>

          <div className='d-flex justify-content-between'>
            <hr />
            <p>OR</p>
            <hr />
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId='formBasicUsername'>
              <FormControl
                type='text'
                placeholder='Username'
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
                className='mr-sm-2'
              />
            </Form.Group>

            <Form.Group controlId='formBasicPassword'>
              <FormControl
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                className='mr-sm-2'
              />
            </Form.Group>
            <div className='d-flex justify-content-between'>
              <Form.Group controlId='formBasicCheckbox'>
                <Form.Check type='checkbox' label='Remeber me' />
              </Form.Group>
              <Button variant='success' id='loginBtn' type='submit'>
                LOG IN
              </Button>
            </div>
            <div className='d-flex justify-content-center'>
              <Link to=''>Forgot your password?</Link>
            </div>
            <hr />
            <div className='signupSection  d-flex flex-column'>
              <span>Don't have an account?</span>
              <Button
                id='signupBtn'
                onClick={() => props.history.push('?signup')}
              >
                SIGN UP
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    </>
  );
}

export default withRouter(LoginComponent);
