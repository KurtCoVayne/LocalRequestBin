// Create express app with Morgan middleware
import express, { json, urlencoded } from 'express';
import cors from 'cors';

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

	// Get requests from any route and console.log
	app.get('*', (req, res) => {
		res.status(200).send(`Got it! from ${req.path}`);
	});

	app.post('*', (req, res) => {
		res.status(200).send(`Got it! from ${req.path}`);
	});

	app.put('*', (req, res) => {
		res.status(200).send(`Got it! from ${req.path}`);
	});

	app.delete('*', (req, res) => {
		res.status(200).send(`Got it! from ${req.path}`);
	});

	const port = process.env.PORT || 3000;

	app.listen(port, () => {
		console.log(`Listening on port ${port}`);
	});
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
