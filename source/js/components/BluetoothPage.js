import React, { Component } from 'react'
import classNames from 'classnames'

export default class BluetoothPage extends Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
		this.state = {
			connectButtonText: 'Подключить',
			steps: localStorage.getItem('steps') || '0',
			showSteps: false,
			showButton: true
		};
	}

	handleClick() {
		// Bluetooth connect logic

		var self = this;
		this.setState({connectButtonText: 'Подключение...'});

		const TRACKER_SERVICE_UUID = 0xFEE7; // device service UUID
		const STEPS_UUID = '0000fea1-0000-1000-8000-00805f9b34fb'; // steps service UUID

		let _server = null;
		let _device = null;
		let _primaryService = null;
		let _characteristics = new Map();
		let deviceName = null;

		function handleDevice(device) {
			console.log("Found device successfully");
			_device = device;
			deviceName = device.name;
			_device.removeEventListener('gattserverdisconnected', function() {
			});
			_device.addEventListener('gattserverdisconnected', _onDisconnect);
			return device.gatt.connect()
				.then(s => {
					console.log('success');
					_server = s;
					return _server.getPrimaryService(TRACKER_SERVICE_UUID)
				})
				.then(service => {
					_primaryService = service;
					return Promise.all(_saveAllCharacteristics(service))

				})
				.then(() => {
					startScanSteps();
					return true;
				})
				.catch(exception => {
					console.error(exception);
					return false;
				})
		}

		function connect() {
			return navigator.bluetooth.requestDevice({
				filters: [{services: [TRACKER_SERVICE_UUID]}]
			})
			.then(function(device) {
				return handleDevice(device);
			})
			.catch(exception => {
				console.error(exception);
				self.setState({ connectButtonText: 'Подключить' });
			});
		}

		function _saveAllCharacteristics(service) {
			return [
				_saveCharacteristic(service, STEPS_UUID)
			]
		}

		function _saveCharacteristic(service, characteristicUUID) {
			console.log('_saveCharacteristic');
			return _primaryService.getCharacteristic(characteristicUUID)
				.then(characteristic => {
					console.log('_saveCharacteristic suc');
					_characteristics.set(characteristicUUID, characteristic);
				})
				.catch(exception => {
					console.log('_saveCharacteristic fail');
					console.error(exception);
				});
		}

		function _onDisconnect(event) {
			let device = event.target;
			console.log('disconnect');
			handleDevice(device);
			self.setState({
				showButton: true,
				showSteps: false,
				connectButtonText: 'Подключить'
			});
		}

		function parseSteps(data) {
			return parseInt( padHex(data.getUint16(1)) + padHex(data.getUint16(0)), 16 ); // Wow
		}

		function scanSteps(callback) {
			let characteristic = _characteristics.get(STEPS_UUID);
			characteristic.addEventListener('characteristicvaluechanged', (event) => {
				let data = event.target.value;
				callback(parseSteps(data));
			});
			characteristic.startNotifications();
		}

		function startScanSteps() {
			scanSteps(updateSteps);
		}

		function updateSteps(value) {
			localStorage.setItem('steps', value);
			self.setState({ steps: value });
		}

		function padHex(value) {
			return ('00' + value.toString(16).toUpperCase()).slice(-2);
		}

		connect().then(result => {
			if (result) {
				startScanSteps();
				self.setState({
					showButton: false,
					showSteps: true
				});
			}
			else {
				console.log("User chose the blue pill");
			}
			self.setState({ connectButtonText: 'Подключить' });
		})
	}

	render() {
		let stepsClasses = classNames('steps', 'screen-center', { hidden: !this.state.showSteps });
		let buttonClasses = classNames('connect-btn', 'screen-center', { hidden: !this.state.showButton });

		return (
			<div>
				<button className={ buttonClasses } onClick={ this.handleClick }>
					{ this.state.connectButtonText }
				</button>
				<div className={ stepsClasses}>
					{ this.state.steps }
				</div>
			</div>
		);
	}
}