import { config } from "winston";

describe("logger", () => {

    describe("log level determination", () => {

        beforeEach(() => {
            jest.resetModules();
            delete process.env.LOG_LEVEL;
        });

        it("should default to info, if no log level is specified", () =>{

            //GIVEN
            const {logger} = require('./logger')

            //WHEN
            const myLogger = logger()

            //THEN
            expect(myLogger.level).toBe("info")
        })

        it("should fallback to info, if the log level is unknown", () =>{

            //GIVEN
            const {logger} = require('./logger')
            process.env.LOG_LEVEL="unknown"

            //WHEN
            const myLogger = logger()

            //THEN
            expect(myLogger.level).toBe("info")
        })


        it.each(Object.keys(config.cli.levels))("should accept log level '%s'", (logLevel) =>{

            //GIVEN
            const {logger} = require('./logger')
            process.env.LOG_LEVEL=logLevel

            //WHEN
            const myLogger = logger()

            //THEN
            expect(myLogger.level).toBe(logLevel)
        })
    })

})