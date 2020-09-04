import React, { useState } from 'react';
import { Container, Card, Button, Row, Col, Toast } from 'react-bootstrap';
import cities from '../data/cities.json';
import { withRouter } from 'react-router-dom';

const App = (props) => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');

  const selectCity = async (name) => {
    setMessage(`${name} was added to your favorite places!`);

    const resp = await fetch(process.env.REACT_APP_API_URL + '/list', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        city: name,
      }),
    });

    if (resp.status === 201) {
      setShow(true);
      setTimeout(() => {
        setShow(false);
      }, 1500);
    } else if (resp.status === 200) {
      setShow(true);
      setMessage(`${name} is already on your favorite places!`);
      setTimeout(() => {
        setShow(false);
      }, 1500);
    }
  };

  return (
    <Container fluid className='selectCitiesContainer'>
      <Button
        onClick={() => props.history.push('/weather')}
        className='nextButton'
        variant='primary'
      >
        Next
      </Button>
      <Row>
        {cities.map((city, key) => (
          <Col key={key}>
            <Card style={{ width: '25rem' }}>
              <Card.Img
                onClick={() => selectCity(city.name)}
                variant='top'
                src={city.img}
              />
              <Card.Body>
                <Card.Title>{city.name}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Toast id='toast' show={show} onClose={() => setShow(!show)}>
        <Toast.Header>
          <strong className='mr-auto'>Admin</strong>
          <small>Notification</small>
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </Container>
  );
};

export default withRouter(App);
