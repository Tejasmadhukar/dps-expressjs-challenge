import swaggerJSDoc from 'swagger-jsdoc';
import { Options } from 'swagger-jsdoc';

const options: Options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Project and Report API',
			version: '1.0.0',
			description: 'API for managing projects and reports',
		},
	},
	apis: ['./src/controllers/*.ts', './src/models/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);
export { swaggerSpec };
