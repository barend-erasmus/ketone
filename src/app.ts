// Imports
import * as express from 'express';
import * as path from 'path';
import * as request from 'request-promise';
import * as yargs from 'yargs';
import { config } from './config';

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
import { APIUsersRouter } from './routes/api/users';
import { ClientsRouter } from './routes/clients';
import { HomeRouter } from './routes/home';
import { ProfileRouter } from './routes/profile';
import { RolesRouter } from './routes/roles';
import { PermissionsRouter } from './routes/permission';
import { UsersRouter } from './routes/users';
import { RoleGroupRouter } from './routes/role-group';

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
    keys: [config.secrets[0]],
    maxAge: 604800000, // 7 Days
    name: 'session',
}));

// Configures view engine
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    helpers: {
        hasPermission: (user, permission, options) => {
            return options.fn(this);
        },
    },
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
    authorizationURL: argv.prod ? `${config.domain}/auth/authorize` : 'http://localhost:3000/auth/authorize',
    callbackURL: argv.prod ? `${config.domain}/auth/callback` : 'http://localhost:3000/auth/callback',
    clientID: config.client.id,
    clientSecret: config.client.secret,
    tokenURL: argv.prod ? `${config.domain}/auth/token` : 'http://localhost:3000/auth/token',
}, (accessToken: string, refreshToken: string, profile: any, cb) => {
    request({
        headers: {
            authorization: `Bearer ${accessToken}`,
        },
        json: true,
        uri: argv.prod ? `${config.domain}/auth/user` : 'http://localhost:3000/auth/user',
    }).then((result: any) => {
        if (result.client_id === config.client.id) {
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
    config.secrets[1],
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

app.get('/profile/edit', ProfileRouter.editGet);

app.get('/roles', RolesRouter.index);
app.post('/roles/create', RolesRouter.create);

app.post('/roleGroups/create', RoleGroupRouter.create);

app.get('/permissions', PermissionsRouter.index);
app.post('/permissions/create', PermissionsRouter.create);

app.get('/api/users', APIUsersRouter.get);

app.get('/logout', (req: express.Request, res: express.Response) => {
    req.logout();
    res.redirect('/');
});

app.use('/api/docs', express.static(path.join(__dirname, './../apidoc')));
app.use('/api/coverage', express.static(path.join(__dirname, './../coverage/lcov-report')));

app.listen(argv.port || 3000, () => {
    console.log(`listening on port ${argv.port || 3000}`);
});
