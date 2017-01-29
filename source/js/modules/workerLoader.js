import config from '../config'

export default function registerSW() {
	navigator.serviceWorker.register(
		`service-worker.js`,
		{ scope: `${config.context}` }
	).then(function(registration) {
		console.log('Service worker registered');

	}).catch(function(err) {
		throw new Error('ServiceWorker error: ' + err);
	});
}
