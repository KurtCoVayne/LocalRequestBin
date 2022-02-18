import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const port = process.env.PORT || 3000;

const requestHandler = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	console.log(`${req.method} ${req.path} HTTP/${req.httpVersion}`);
	for (const key in req.headers) {
		console.log(`${key}: ${req.headers[key]}`);
	}
	console.log(`Body: ${JSON.stringify(req.body)}`);
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	res.setHeader('Set-Cookie', 'cookie=value; Path=/; HttpOnly');

	const path = req.path.substring(1);
	let url: URL | null = null;
	try {
		url = new URL(path);
	} catch (e) { 
		console.log(`Not proxying request at ${path}`);
	}
	if (url && (url.protocol === 'http:' || url.protocol === 'https:')) {
		console.log(`Proxying request at ${path}`);
		return createProxyMiddleware({
			target: url.protocol + '//' + url.host,
			pathRewrite: () => {
				return url!.pathname;
			},
			changeOrigin: true,
			secure: false,
			logLevel: 'debug',
			onProxyReq: (proxyReq, req, res) => {
				res.setHeader('Access-Control-Allow-Origin', '*');
				res.setHeader('Access-Control-Allow-Headers', '*');
				res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
				proxyReq.setHeader('X-Forwarded-For', req.ip);
				proxyReq.setHeader('X-Forwarded-Proto', req.protocol);
				proxyReq.setHeader('X-Forwarded-Host', req.hostname);
				proxyReq.setHeader('X-Forwarded-Server', req.hostname);
			}})(req, res, next);
	} else {
		res.status(200).send("Got it but not proxying");
		next();
	}
};


const main = async () => {
	const app = express();
	app.use(requestHandler);

	app.listen(port, () => {
		console.log(`Listening on port ${port}`);
	});
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
