// Imports
import * as express from 'express';
import * as path from 'path';
import * as request from 'request-promise';
import * as yargs from 'yargs';
import { config } from './config';

// Import Repositories
import { BaseRepository } from './repositories/sequelize/base';
import { ClientRepository } from './repositories/sequelize/client';
import { EventRepository } from './repositories/sequelize/event';
import { KetoneUserRepository } from './repositories/sequelize/ketone-user';
import { TokenRepository } from './repositories/sequelize/token';
import { UserRepository } from './repositories/sequelize/user';

// Imports middleware
import * as bodyParser from 'body-parser';
import * as cookieSession from 'cookie-session';
import * as cors from 'cors';
import * as exphbs from 'express-handlebars';
import * as passport from 'passport';
import * as OAuth2Strategy from 'passport-oauth2';

import { OAuth2FrameworkRouter } from 'oauth2-framework';

import { Model } from './model';

// Imports models
import { KetoneUser } from './entities/ketone-user';

// Imports routes
import { AboutRouter } from './routes/about';
import { APIUsersRouter } from './routes/api/users';
import { ClientsRouter } from './routes/clients';
import { ContactRouter } from './routes/contact';
import { HomeRouter } from './routes/home';
import { PermissionsRouter } from './routes/permission';
import { ProfileRouter } from './routes/profile';
import { RoleGroupRouter } from './routes/role-group';
import { RolesRouter } from './routes/roles';
import { UsersRouter } from './routes/users';

const clientRepository = new ClientRepository(config.database.host, config.database.username, config.database.password);
const ketoneUserRepository = new KetoneUserRepository(config.database.host, config.database.username, config.database.password);
const userRepository = new UserRepository(config.database.host, config.database.username, config.database.password);
const eventRepository = new EventRepository(config.database.host, config.database.username, config.database.password);
const tokenRepository = new TokenRepository(config.database.host, config.database.username, config.database.password);

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
        hasPermission: (user: KetoneUser, permissions: string, options: any) => {
            if (user.role && permissions.split(',').filter((x) => user.role.permissions.filter((y) => y.name === x).length === 0).length == 0) {
                return options.fn(this);
            }
        },
        ifEqual: (a, b, options) => {
            if (a === b) {
                return options.fn(this);
            }
        },
        ifEqualRole: (a, b, options) => {

            let result: boolean = false;

            if (a && b) {
                if (a.name === b.name && a.group.name === b.group.name) {
                    result = true;
                }
            }

            if (result) {
                return options.fn(this);
            }
        },
        ifNotEqual: (a, b, options) => {
            if (a !== b) {
                return options.fn(this);
            }
        },
        ifNotEqualRole: (a, b, options) => {

            let result: boolean = true;

            if (a && b) {
                if (a.name === b.name && a.group.name === b.group.name) {
                    result = false;
                }
            }

            if (result) {
                return options.fn(this);
            }
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

passport.deserializeUser((id: string, done: (err: Error, obj: any) => void) => {
    ketoneUserRepository.find(id).then((user: KetoneUser) => {
        done(null, user);
    });
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
        } else {
            return cb(new Error('Invalid Client Id'), null);
        }
    }).catch((err: Error) => {
        return cb(err, null);
    });
}));

app.use('/auth', OAuth2FrameworkRouter(
    new Model(clientRepository, ketoneUserRepository, userRepository, eventRepository, tokenRepository, config.secrets[2]),
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

function requireUser(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!req.user) {
        res.redirect(config.paths.unauthorized);
        return;
    }

    next();
}

app.get('/auth/login', passport.authenticate('oauth2'));

app.get('/auth/callback', passport.authenticate('oauth2', { failureRedirect: '/auth/login' }),
    (req: express.Request, res: express.Response) => {
        res.redirect('/');
    });

app.get('/', requireUser, HomeRouter.index);

app.get('/about', AboutRouter.index);

app.post('/contact', ContactRouter.send);

app.get('/clients', requireUser, ClientsRouter.index);
app.get('/clients/edit', requireUser, ClientsRouter.editGet);
app.post('/clients/edit', requireUser, ClientsRouter.editPost);
app.post('/clients/addScope', requireUser, ClientsRouter.addScope);
app.get('/clients/removeScope', requireUser, ClientsRouter.removeScope);
app.post('/clients/addRedirectUri', requireUser, ClientsRouter.addRedirectUri);
app.get('/clients/removeRedirectUri', requireUser, ClientsRouter.removeRedirectUri);
app.get('/clients/create', requireUser, ClientsRouter.createGet);
app.post('/clients/create', requireUser, ClientsRouter.createPost);

app.get('/users', requireUser, UsersRouter.index);
app.get('/users/edit', requireUser, UsersRouter.editGet);
app.post('/users/edit', requireUser, UsersRouter.editPost);
app.get('/users/create', requireUser, UsersRouter.createGet);
app.post('/users/create', requireUser, UsersRouter.createPost);

app.get('/profile/edit', requireUser, ProfileRouter.editGet);

app.get('/roles', requireUser, RolesRouter.index);
app.post('/roles/create', requireUser, RolesRouter.create);
app.get('/roles/edit', requireUser, RolesRouter.edit);

app.post('/roleGroups/create', requireUser, RoleGroupRouter.create);

app.get('/permissions', requireUser, PermissionsRouter.index);
app.post('/permissions/create', requireUser, PermissionsRouter.create);

app.get('/api/users/:clientId', APIUsersRouter.getUsers);
app.get('/api/users/:clientId/:username', APIUsersRouter.getUser);

app.get('/logout', requireUser, (req: express.Request, res: express.Response) => {
    req.logout();
    res.redirect('/');
});

app.use('/api/docs', express.static(path.join(__dirname, './../apidoc')));
app.use('/api/coverage', express.static(path.join(__dirname, './../coverage/lcov-report')));

app.listen(argv.port || 3000, () => {
    console.log(`listening on port ${argv.port || 3000}`);
});
