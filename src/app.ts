// Imports
import * as express from 'express';
import * as path from 'path';
import * as request from 'request-promise';
import * as yargs from 'yargs';

// Imports middleware
import * as bodyParser from 'body-parser';
import * as cookieSession from 'cookie-session';
import * as cors from 'cors';
import * as exphbs from 'express-handlebars';
import * as passport from 'passport';
import * as OAuth2Strategy from 'passport-oauth2';

import { OAuth2FrameworkRouter } from 'oauth2-framework';

import { Model } from './model';

// Imports routes
import { ClientsRouter } from './routes/clients';
import { HomeRouter } from './routes/home';
import { UsersRouter } from './routes/users';

const argv = yargs.argv;
const app = express();

// Configures body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configures cors
app.use(cors());

// Configures static content
app.use('/static', express.static(path.join(__dirname, 'public')));

// Configures session
app.use(cookieSession({
    keys: ['OIdowGt3f79dGaiAXJWq'],
    maxAge: 604800000, // 7 Days
    name: 'session',
}));

// Configures view engine
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// Configures passport
app.use(passport.initialize());

passport.serializeUser((user: any, done: (err: Error, obj: any) => void) => {
    done(null, user.username);
});

passport.deserializeUser((id: Error, done: (err: Error, obj: any) => void) => {
    done(null, id);
});

app.use(passport.session());

passport.use(new OAuth2Strategy({
    authorizationURL: argv.prod ? 'https://ketone.openservices.co.za/auth/authorize' : 'http://localhost:3000/auth/authorize',
    callbackURL: argv.prod ? 'https://ketone.openservices.co.za/auth/callback' : 'http://localhost:3000/auth/callback',
    clientID: 'fLTSn80KPQNOPCS2R7dq',
    clientSecret: '8XjrVJiYMqPaDiJfH21X',
    tokenURL: argv.prod ? 'https://ketone.openservices.co.za/auth/token' : 'http://localhost:3000/auth/token',
}, (accessToken: string, refreshToken: string, profile: any, cb) => {
    request({
        headers: {
            authorization: `Bearer ${accessToken}`,
        },
        json: true,
        uri: argv.prod ? 'https://ketone.openservices.co.za/auth/user' : 'http://localhost:3000/auth/user',
    }).then((result: any) => {
        if (result.client_id === 'fLTSn80KPQNOPCS2R7dq') {
            return cb(null, result);
        }else {
            return cb(new Error('Invalid Client Id'), null);
        }
    }).catch((err: Error) => {
        return cb(err, null);
    });
}));

app.use('/auth', OAuth2FrameworkRouter(
    new Model(),
    path.join(__dirname, 'views/login.handlebars'),
    path.join(__dirname, 'views/forgot-password.handlebars'),
    path.join(__dirname, 'views/forgot-password-success.handlebars'),
    path.join(__dirname, 'views/forgot-password-failure.handlebars'),
    null,
    path.join(__dirname, 'views/register.handlebars'),
    null,
    null,
    null,
    null,
    'j211gJtch7IFxl6mkI6i',
));

app.get('/auth/login', passport.authenticate('oauth2'));

app.get('/auth/callback', passport.authenticate('oauth2', { failureRedirect: '/auth/login' }),
    (req: express.Request, res: express.Response) => {
        res.redirect('/');
    });

app.get('/', HomeRouter.index);

app.get('/clients', ClientsRouter.index);
app.get('/clients/edit', ClientsRouter.editGet);
app.post('/clients/edit', ClientsRouter.editPost);
app.post('/clients/addScope', ClientsRouter.addScope);
app.get('/clients/removeScope', ClientsRouter.removeScope);
app.post('/clients/addRedirectUri', ClientsRouter.addRedirectUri);
app.get('/clients/removeRedirectUri', ClientsRouter.removeRedirectUri);
app.get('/clients/create', ClientsRouter.createGet);
app.post('/clients/create', ClientsRouter.createPost);

app.get('/users', UsersRouter.index);
app.get('/users/edit', UsersRouter.editGet);
app.post('/users/edit', UsersRouter.editPost);
app.get('/users/create', UsersRouter.createGet);
app.post('/users/create', UsersRouter.createPost);

app.get('/logout', (req: express.Request, res: express.Response) => {
    req.logout();
    res.redirect('/');
});

app.listen(argv.port || 3000, () => {
    console.log(`listening on port ${argv.port || 3000}`);
});
