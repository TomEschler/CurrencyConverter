import React, { Component } from 'react';
import Converter from './Converter';


class App extends Component {
  render() {
    return (
      <div id="currencyConverterApp">
        <section className="currencyConvComponent">
          <Converter/>
        </section>
        <div>
         
        </div>
      </div>
    );
  }
}

export default App;