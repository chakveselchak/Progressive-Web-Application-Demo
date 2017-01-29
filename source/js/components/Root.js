import React, { Component } from 'react'
import Note from './Note'
import BluetoothPage from './BluetoothPage'

import SwipeViews from 'react-swipe-views'

import bearPath from '../../img/bear.gif';

export default class InstaPost extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<SwipeViews>
				<div title={ <i className="icon-disc"></i> }>
					<div className="centered-container">
						<h1>Заметка</h1>
						<Note/>
					</div>
				</div>
				<div title={ <i className="icon-tracker"></i> }>
					<div className="centered-container">
						<BluetoothPage />
					</div>
				</div>
				<div title={ <i className="icon-hipster"></i> }>
					<div className="centered-container">
						<h1>Здесь ничего нет. Эта страница нужна для красоты, так как 3 таба сверху смотрятся куда лучше, чем 2.</h1>
						<div className="img-wrapper text-center">
							<img src={ bearPath } alt="Bear" width="320px"/>
						</div>
					</div>
				</div>
			</SwipeViews>
		);
	}
}
