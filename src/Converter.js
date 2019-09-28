import React, { Component } from "react";
import axios from "axios";
import './styles.css';

export default class Converter extends Component {
    state = {
        result: 0,
        fromCurrency: "EUR",
        toCurrency: "USD",
        amount: 1,
        currencies: [],
    };

    // Initializes the currencies with values from the Openrates API
    componentDidMount() {
        axios
            .get("https://vschool-cors.herokuapp.com?url=https://api.openrates.io/latest")
            .then(response => {
                // Initialized with 'EUR' because the base currency is 'EUR'
                // and it is not included in the response
                const currencyAr = ["EUR"]
                for (const key in response.data.rates) {
                    currencyAr.push(key)
                }
                this.setState({ currencies: currencyAr.sort() })
            })
            .catch(err => {
                console.log("Oops, something broke with GET in componentDidMount() - we've got a: ", err.message);
            });
    }

    // Event handler for the conversion BROKEN due to CORS policy
    // https://q777nnrzpw.codesandbox.io/ WORKS here - 
    convertHandler = () => {
        if (this.state.fromCurrency !== this.state.toCurrency) {
            axios.get(`https://vschool-cors.herokuapp.com?url=http://api.openrates.io/latest?base=${this.state.fromCurrency}&symbols=${this.state.toCurrency}`)
                .then(response => {
                    const result = this.state.amount * (response.data.rates[this.state.toCurrency]);
                    this.setState({ result: result.toFixed(5) })
                })
                .catch(err => {
                    console.log("Oops, something broke with GET in convertHandler() - we've got a: ", err.message);
                });
        } else {
            this.setState({ result: "You can't convert the same currency!" })
        }
    };

    // Updates the states based on the dropdown that was changed
    selectHandler = (event) => {
        if (event.target.name === "from") {
            this.setState({ fromCurrency: event.target.value })
        }
        if (event.target.name === "to") {
            this.setState({ toCurrency: event.target.value })
        }
    }

    render() {
        return (
            <div className="Converter-container">
                <div className='header'><h2><span>How many $'s? </span> </h2></div>
                <div className='result'>{this.state.result && <h3>{this.state.result}</h3>}</div>
                <div className="amount-entered">
                    <input
                        name="amount"
                        type="text"
                        value={this.state.amount}
                        onChange={event =>
                            this.setState({ amount: event.target.value })
                        }>
                    </input>
                    <button onClick={this.convertHandler}>Convert</button>
                </div>
                <div className='this-to-that'>
                    <div className='this'>
                        <select
                        name="from"
                        onChange={(event) => this.selectHandler(event)}
                        value={this.state.fromCurrency}>
                        {this.state.currencies.map(cur => (
                            <option key={cur}>{cur}</option>
                        ))}
                        </select>
                    </div>
                    <div className='that'>
                        <select id='usd'
                            name="to"
                            onChange={(event) => this.selectHandler(event)}
                            value={this.state.toCurrency}>
                            {this.state.currencies.map(cur => (
                                <option key={cur}>{cur}</option>
                            ))}
                        </select>
                </div>
                </div>
            </div>
        )
    }
}