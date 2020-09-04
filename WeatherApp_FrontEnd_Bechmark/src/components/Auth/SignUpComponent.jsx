import React, { useState } from 'react';
import { Container, Image, Button, FormControl, Form } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';

function SignUpComponent(props) {
  const [username, setUsername] = useState('');
  const [password, setpassword] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastName] = useState('');

  const validatePass = (pass) => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return re.test(String(pass));
  };

  const signUp = async () => {
    const resp = await axios(
      `${process.env.REACT_APP_API_URL}/users/register`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          name,
          lastname,
          username,
          password,
        },
        method: 'POST',
      }
    );
    if (resp.status === 201) props.history.push('/');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signUp();
  };

  return (
    <>
      <Container>
        <div className='signupContent d-flex flex-column'>
          <span id='title'>Sign up for free to get weather data.</span>
          <Button
            id='facebookBtn'
            onClick={() =>
              alert(
                "We haven't implemented this feature yet but you can sign up"
              )
            }
          >
            SIGN UP WITH FACEBOOK
          </Button>
          <div className='d-flex justify-content-between'>
            <hr />
            <p>OR</p>
            <hr />
          </div>
          <span>Sign up with your credentials</span>

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId='formBasicName'>
              <Form.Label>Name</Form.Label>
              <FormControl
                type='text'
                placeholder='Enter your name.'
                className='mr-sm-2'
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId='formBasicLastName'>
              <Form.Label>Last Name</Form.Label>
              <FormControl
                type='text'
                placeholder='Enter your lastname.'
                className='mr-sm-2'
                value={lastname}
                onChange={(e) => setLastName(e.currentTarget.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId='formBasicUsername'>
              <Form.Label>Set your username</Form.Label>
              <FormControl
                type='text'
                placeholder='Enter your username.'
                className='mr-sm-2'
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId='formBasicPassword'>
              <Form.Label>Create a password</Form.Label>
              <FormControl
                type='password'
                placeholder='Create a password.'
                className='mr-sm-2'
                value={password}
                onChange={(e) => setpassword(e.currentTarget.value)}
                required
              />
              {password && !validatePass(password) && (
                <div className='errorMessage'>
                  Should contain at least 8 chars, 1 digit, 1 letter
                </div>
              )}
            </Form.Group>

            <div className='signupSection  d-flex flex-column'>
              <Button id='registerButton' type='submit'>
                SIGN UP
              </Button>
              <div className='d-flex justify-content-center'>
                <span>
                  Have an account?{' '}
                  <span onClick={() => props.history.push('/')}>Log in</span> .
                </span>
              </div>
            </div>
          </Form>
        </div>
      </Container>
    </>
  );
}

export default withRouter(SignUpComponent);
