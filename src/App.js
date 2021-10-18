import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import FeedbackForm from './components/feedbackForm/feedbackForm';

import './App.css';

class App extends Component {

  render () {
    return (
      <BrowserRouter>
        <Route exact path='/' component={ FeedbackForm } />
      </BrowserRouter>
    )
  }
}

export default App;