// Imports
import * as Sequelize from 'sequelize';

export class BaseRepository {
    protected static sequelize: Sequelize.Sequelize = null;
    protected static models: {
        Client: Sequelize.Model<{}, {}>,
        AllowedScope: Sequelize.Model<{}, {}>,
        RedirectUri: Sequelize.Model<{}, {}>,
        User: Sequelize.Model<{}, {}>,
        KetoneUser: Sequelize.Model<{}, {}>,
    } = null;

    private static defineModels(): void {
        const Client = BaseRepository.sequelize.define('client', {
            allowForgotPassword: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
            },
            allowRegister: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
            },
            key: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            secret: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        const AllowedScope = BaseRepository.sequelize.define('allowedScope', {
            name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        const RedirectUri = BaseRepository.sequelize.define('redirectUri', {
            uri: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        const User = BaseRepository.sequelize.define('user', {
            emailAddress: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            password: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            username: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            verified: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
            },
        });

        const KetoneUser = BaseRepository.sequelize.define('ketoneUser', {
            emailAddress: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            password: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            username: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            verified: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
            },
        });

        Client.hasMany(AllowedScope);
        AllowedScope.belongsTo(Client);

        Client.hasMany(RedirectUri);
        RedirectUri.belongsTo(Client);

        Client.hasMany(User);
        User.belongsTo(Client);

        KetoneUser.hasMany(Client);
        Client.belongsTo(KetoneUser);

        this.models = {
            AllowedScope,
            Client,
            KetoneUser,
            RedirectUri,
            User,
        };
    }

    constructor(private host: string, private username: string, private password: string) {

        if (!BaseRepository.sequelize) {
            BaseRepository.sequelize = new Sequelize('ketone', username, password, {
                dialect: 'postgres',
                host,
                pool: {
                    idle: 10000,
                    max: 5,
                    min: 0,
                },
            });

            BaseRepository.defineModels();
        }
    }

    public sync(): Promise<void> {
        return new Promise((resolve, reject) => {
            BaseRepository.sequelize.sync({ force: true }).then(() => {
                resolve();
            });
        });
    }

    public close(): void {
        BaseRepository.sequelize.close();
    }
}