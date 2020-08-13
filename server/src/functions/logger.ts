import { config, createLogger, format, Logger, transports } from "winston";

let loggerInstance: Logger | undefined;
const loggingFormat = format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(info => `[${info.timestamp}] [${info.level}]: ${info.message}`)
);

function getLogLevel() {
    const logLevel = process.env.LOG_LEVEL;
    if(logLevel){
        if(logLevel in config.cli.levels){
            return logLevel
        }else{
            console.log(`[warning] Could not initialize logger by provided config due to unknown log level "${logLevel}". Setting log level to "info".`)
        }
    }
    return "info"
}

export function logger() {
    if(!loggerInstance){
        loggerInstance = createLogger({
            level: getLogLevel(),
            format: loggingFormat,
            transports:
                [new transports.Console()]
        });
    }
    return loggerInstance;
}