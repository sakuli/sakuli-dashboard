import { createLogger, format, Logger, transports } from "winston";

const logLevel = process.env.LOG_LEVEL;
let loggerInstance: Logger | undefined;
const loggingFormat = format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(info => `[${info.timestamp}] [${info.level}]: ${info.message}`)
);

export function logger() {
    if(!loggerInstance){
        loggerInstance = createLogger({
            level: logLevel || "info",
            format: loggingFormat,
            transports:
                [new transports.Console()]
        });
    }
    return loggerInstance;
}