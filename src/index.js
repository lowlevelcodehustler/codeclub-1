/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
//POST request functionality constants
//Hostname
const thisHost = 'https://hello-post.code-club-emea.workers.dev';
//Path append
const url = thisHost + '/requests/json';
//Document body
const body = {
	results: ['default result data'],
	errors: null,
	msg: 'This is sent to the associated fetch function',
};

export default {
	async fetch(request, env, ctx) {
		return new Response("Hello World!");
	}

	//Added POST request functionality
	//Initialise async function for POST REQUEST
	//Initialise async to gather up responses
	async function getResponse(response) {
		// Constant for headers as response
		const { headers } = response;
		//Constant to determine content type - JSON or other
		//Return text if not JSON
		const contentType = headers.get('content-type') || '';
		if (contentType.includes('application/json')) {
			return JSON.stringify(await response.json());
		} else {
		return response.text();
		}
	}
	// Function to perform POST request
	async function postRequest() {
		// Initialise request by HTTP method and headers to send
		const init = {
			body: JSON.stringify(body),
			method: 'POST',
			headers: {
				'content-type': 'application/json;charset=UTF-8',
			},
		};
		//Cosntant to await fetch response
		const response = await fetch(url, init);
		const result = await getResponse(response);
		return new Response(result,init);
	}
	//Listen for POST request event
	addEventListener('fetch', event => {
		return event.respondWith(postRequest());
});
};
