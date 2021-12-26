// Create express app with Morgan middleware
import express, { json, urlencoded } from 'express';
import cors from 'cors';

const logRequest = (
	req: express.Request,
	_res: express.Response,
	next: express.NextFunction
) => {
	console.log(`${req.method} ${req.path} HTTP/${req.httpVersion}`);
	for (const key in req.headers) {
		console.log(`${key}: ${req.headers[key]}`);
	}
	console.log(`Body: ${JSON.stringify(req.body)}`);

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
		res.cookie('name', 'value');
		res.status(200).send(`Got it! from ${req.path}`);
	});

	app.put('*', (req, res) => {
		res.cookie('name', 'value');
		res.status(200).send(`Got it! from ${req.path}`);
	});

	app.delete('*', (req, res) => {
		res.cookie('name', 'value');
		res.status(200).send(`Got it! from ${req.path}`);
	});

	app.listen(3000, () => {
		console.log('Listening on port 3000');
	});
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
