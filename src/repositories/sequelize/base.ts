// Imports
import * as Sequelize from 'sequelize';

export class BaseRepository {
    protected static sequelize: Sequelize.Sequelize = null;
    protected static models: {
        Client: Sequelize.Model<{}, {}>,
        AllowedScope: Sequelize.Model<{}, {}>,
        RedirectUri: Sequelize.Model<{}, {}>,
        Role: Sequelize.Model<{}, {}>,
        User: Sequelize.Model<{}, {}>,
        KetoneUser: Sequelize.Model<{}, {}>,
        Event: Sequelize.Model<{}, {}>,
        Permission: Sequelize.Model<{}, {}>,
        RoleGroup: Sequelize.Model<{}, {}>,
        RolePermissions: Sequelize.Model<{}, {}>,
        Token: Sequelize.Model<{}, {}>,
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

        const RoleGroup = BaseRepository.sequelize.define('roleGroup', {
            name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        const Role = BaseRepository.sequelize.define('role', {
            name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        const Permission = BaseRepository.sequelize.define('permission', {
            name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        const RolePermissions = BaseRepository.sequelize.define('rolePermission', {

        });

        const User = BaseRepository.sequelize.define('user', {
            emailAddress: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            enabled: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
            },
            password: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            profileImage: {
                allowNull: true,
                type: Sequelize.TEXT,
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
            apiKey: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            emailAddress: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            enabled: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
            },
            password: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            profileImage: {
                allowNull: true,
                type: Sequelize.TEXT,
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

        const Event = BaseRepository.sequelize.define('event', {
            clientId: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            ipAddress: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            username: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        const Token = BaseRepository.sequelize.define('token', {
            value: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            clientId: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            username: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            scopes: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            type: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        Client.hasMany(AllowedScope, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        AllowedScope.belongsTo(Client, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        Client.hasMany(RedirectUri, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        RedirectUri.belongsTo(Client, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        Client.hasMany(RoleGroup, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        RoleGroup.belongsTo(Client, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        RoleGroup.hasMany(Role, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        Role.belongsTo(RoleGroup, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        Client.hasMany(Permission, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        Permission.belongsTo(Client, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        // Permission.belongsToMany(Role, {
        //     foreignKey: { allowNull: false },
        //     onDelete: 'CASCADE',
        //     through: {
        //         model: RolePermissions,
        //         unique: true,
        //     },
        // });

        // Role.belongsToMany(Permission, {
        //     foreignKey: { allowNull: false },
        //     onDelete: 'CASCADE',
        //     through: {
        //         model: RolePermissions,
        //         unique: true,
        //     },
        // });

        Role.hasMany(RolePermissions);
        RolePermissions.belongsTo(Role);

        Permission.hasMany(RolePermissions);
        RolePermissions.belongsTo(Permission);

        Client.hasMany(User, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        User.belongsTo(Client, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        KetoneUser.hasMany(Client, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        Client.belongsTo(KetoneUser, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        Role.hasOne(User, { foreignKey: { allowNull: true }, onDelete: 'CASCADE' });
        User.belongsTo(Role, { foreignKey: { allowNull: true }, onDelete: 'CASCADE' });

        Role.hasOne(KetoneUser, { constraints: false, foreignKey: { allowNull: true } });
        KetoneUser.belongsTo(Role, { constraints: false, foreignKey: { allowNull: true } });

        Role.hasOne(Client, { as: 'defaultRole', constraints: false, foreignKey: { allowNull: true } });
        Client.belongsTo(Role, { as: 'defaultRole', constraints: false, foreignKey: { allowNull: true } });

        this.models = {
            AllowedScope,
            Client,
            Event,
            KetoneUser,
            Permission,
            RedirectUri,
            Role,
            RoleGroup,
            RolePermissions,
            Token,
            User,
        };
    }

    constructor(private host: string, private username: string, private password: string) {

        if (!BaseRepository.sequelize) {
            BaseRepository.sequelize = new Sequelize('ketone', username, password, {
                dialect: 'postgres',
                host,
                logging: false,
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
