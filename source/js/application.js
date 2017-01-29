import React from 'react'
import { render } from 'react-dom'
import '../less/styles.less'
import Root from './components/Root'
import registerSW from './modules/workerLoader'

if ('serviceWorker' in navigator) {
	registerSW();
}

render(
	<Root />,
	document.getElementById('root')
);