import React, { Component } from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { render } from '@testing-library/react';

class Weather extends Component {
  state = {
    citites: [],
    weatherData: [],
  };

  componentDidMount = async () => {
    const resp = await fetch(process.env.REACT_APP_API_URL + '/list', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (resp.ok) {
      const data = await resp.json();
      this.setState({
        citites: data,
      });
    }
  };

  fetchWeatherData = async () => {
    const promises = [];

    this.state.citites.map((ct) =>
      promises.push(
        fetch(process.env.REACT_APP_API_URL + '/list/weather/' + ct.city, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((resp) => resp.json())
          .then((data) => {
            const weatherData = this.state.weatherData;
            weatherData.push(data);
            this.setState({ weatherData });
          })
      )
    );

    Promise.all(promises);
    console.log(promises);
    console.log(this.state.weatherData);
  };

  componentDidUpdate = async (prevProps, prevState) => {
    if (prevState.citites !== this.state.citites) {
      this.fetchWeatherData();
    }
  };

  render() {
    return (
      <Container fluid className='selectCitiesContainer'>
        <Row>
          {this.state.weatherData.map((city, key) => (
            <Col key={key}>
              <Card style={{ width: '18rem' }}>
                <Card.Body>
                  <Card.Title>{city.name}</Card.Title>
                  <p>{city.weather[0].description}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    );
  }
}

export default Weather;
