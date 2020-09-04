import React from 'react';
import LoginComponent from './LoginComponent';
import SignUpComponent from './SignUpComponent';
import '../../styles/signup.css';
import '../../styles/login.css';

function Login(props) {
  return (
    <>
      {props.location.search !== '?signup' ? (
        <>
          <LoginComponent />
        </>
      ) : (
        <>
          <SignUpComponent />
        </>
      )}
    </>
  );
}

export default Login;
