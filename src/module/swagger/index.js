import swaggerUi from 'swagger-ui-koa';
import swaggerJSDoc from 'swagger-jsdoc';
import convert from 'koa-convert';
import mount from 'koa-mount';
//import swaggerDocument from './swagger.json';

export default function (app) {
    //without jsdoc from swagger.json
  //app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  const options = {
    swaggerDefinition: {
      info: {
        title: 'API', // Title (required)
        version: '2.0.0', // Version (required)
      },
    },
    apis: [
      './src/module/swagger/swagger.yaml',
      './src/routes/*.js', // Path to the API docs from root
      './src/module/swagger/parameters.yaml'
    ],
  };
    // Initialize swagger-jsdoc -> returns validated swagger spec in json format
  const swaggerSpec = swaggerJSDoc(options);
  app.use(swaggerUi.serve); //serve swagger static files
  app.use(convert(mount('/swagger', swaggerUi.setup(swaggerSpec)))); //mount endpoint for access
}