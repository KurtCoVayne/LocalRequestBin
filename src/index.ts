// Create express app with Morgan middleware
import express, { json, urlencoded } from 'express';
import cors from 'cors';
import https from "https";
import axios from 'axios';

const logRequest = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	console.log(`${req.method} ${req.path} HTTP/${req.httpVersion}`);
	for (const key in req.headers) {
		console.log(`${key}: ${req.headers[key]}`);
	}
	console.log(`Body: ${JSON.stringify(req.body)}`);
	res.setHeader('Set-Cookie', 'cookie=value; Path=/; HttpOnly');

	next();
};

const main = async () => {
	const app = express();
	app.use(cors());
	app.use(urlencoded({ extended: true }));
	app.use(json());
	app.use(logRequest);

	const httpsAgent = new https.Agent({
		rejectUnauthorized: false
	});

	
	const general_request_handler = (req: express.Request, res: express.Response) => {
		const path = req.path.substring(1);
		let url: URL | null = null;
		try {
			url = new URL(path);
		} catch (error) {
			console.log("Not proxying request");
			url = null;
		}
		if (url && (url.protocol === 'http:' || url.protocol === 'https:')) {
			axios.get(path, { httpsAgent })
				.then(response => {
					res.status(response.status).send(response.data);
				})
				.catch(error => {
					res.status(error.response.status).send(error.response.data);
				}
			);
		} else {
			res.status(200).send(`Got it!, from ${req.path}`);
		}
	}

	app.get('*', general_request_handler);

	app.post('*', general_request_handler);

	app.put('*', general_request_handler);

	app.delete('*', general_request_handler);

	const port = process.env.PORT || 3000;

	app.listen(port, () => {
		console.log(`Listening on port ${port}`);
	});
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
