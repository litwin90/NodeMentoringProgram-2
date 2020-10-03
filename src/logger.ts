import * as Winston from 'winston';

const devFormat = Winston.format.printf(({ level, message, module }) => {
    return `${level} [${module}]: ${message}`;
});

const format = Winston.format.combine(
    Winston.format.colorize(),
    process.env.NODE_ENV === 'production' ? Winston.format.json() : devFormat,
);

const logger = Winston.createLogger({
    level: 'info',
    format,
    transports: [new Winston.transports.Console()],
});

const commonLogger = logger.child({ module: 'common' });
const apiLogger = logger.child({ module: 'api' });
const sequelizeLogger = logger.child({ module: 'sequelize' });

export { apiLogger, commonLogger, sequelizeLogger };
