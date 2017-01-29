import React, { Component } from 'react'


export default class Note extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		if (localStorage.getItem('note')) {
			this.refs.note.value = localStorage.getItem('note');
		}
	}

	handleChange(event) {
		let value = event.target.value;
		localStorage.setItem('note', value);
	}

	render() {
		return (
			<textarea className="form-control"
			          placeholder="Введите что-нибудь"
			          maxLength="255"
			          ref="note"
			          onChange={ (e) => this.handleChange(e) }
			          >
			</textarea>
		);
	}
}