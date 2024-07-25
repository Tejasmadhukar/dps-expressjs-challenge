import morgan from 'morgan';

const customFormat =
	':method :url :status :res[content-length] - :response-time ms';

const loggerMiddleware = morgan(customFormat, {
	stream: process.stdout,
});

export default loggerMiddleware;
