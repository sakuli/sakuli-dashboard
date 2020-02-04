import getConfig, { ConfigMap } from "./config.service";

describe('config service', () => {
    const configMap: ConfigMap = new Map();
    const setSpy = jest.spyOn(configMap, 'set');

    afterEach(() => {
        configMap.clear();
        jest.clearAllMocks();
    });


    it('should throw when environment variable is undefined', () => {
        //Given
        const environmentVariable: string = (undefined as any) as string;

        //When
        const config = () => getConfig(environmentVariable);

        //Then
        expect(config).toThrowError("Invalid configuration: Environment variable is undefined");
    });

    it('should should throw due to invalid json', () => {
        //Given
        const environmentVariable = '{ invalid json }';

        //When
        const config = () => getConfig(environmentVariable);

        //Then
        expect(config).toThrowError("Invalid configuration: Could not parse environment variable");
    });

    it('should get config with setting new entry in configMap', () => {
        //Given
        const environmentVariable = '{ "name": "foo" }';

        //When
        const config = getConfig(environmentVariable, configMap);


        //Then
        expect(config).toEqual(JSON.parse(environmentVariable));
        expect(setSpy).toHaveBeenCalledTimes(1);
    });

    it('should only set configMap once after calling getConfig twice', () => {
        //Given
        const environmentVariable = '{ "name": "foo" }';

        //When
        getConfig(environmentVariable, configMap);
        const config = getConfig(environmentVariable, configMap);

        //Then
        expect(config).toEqual(JSON.parse(environmentVariable));
        expect(setSpy).toHaveBeenCalledTimes(1);
    });

});