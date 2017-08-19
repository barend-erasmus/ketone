// http://localhost:3000/auth/authorize?response_type=code&client_id=0zyrWYATtw&redirect_uri=http://localhost:3000/auth/passport/callback&state=40335

// Imports
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as path from 'path';
import * as yargs from 'yargs';
import * as cors from 'cors';

import { OAuth2FrameworkRouter } from 'oauth2-framework';

import { Model } from './model';

const argv = yargs.argv;
const app = express();

// Configures middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Configure static content
app.use('/static', express.static(path.join(__dirname, 'public')));

app.use('/auth', OAuth2FrameworkRouter(
    new Model(),
    path.join(__dirname, 'views/login.handlebars'),
    null,
    null,
    null,
    null,
    path.join(__dirname, 'views/register.handlebars'),
    null,
    null,
    null,
    null,
    'j211gJtch7IFxl6mkI6i',
));

app.listen(argv.port || 3000, () => {
    console.log(`listening on port ${argv.port || 3000}`);
});