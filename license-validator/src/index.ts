import {PluginValidator} from "@sakuli/plugin-validator";
import chalk from "chalk";

const LICENSE_KEY = "SAKULI_LICENSE_KEY";
const CONTAINER_IMAGE = "IMG";

const getLicenseToken = () => process.env[LICENSE_KEY];
const getImageName = () => process.env[CONTAINER_IMAGE] || "UNKNOWN_IMAGE";

const getContainerToken = () => "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJjYXRlZ29yeSI6OCwiaWF0IjoxNTk2NjI2MTY0LCJhdWQiOiJ0YWNvbnNvbC9zYWt1bGktZGFzaGJvYXJkIiwiaXNzIjoic2FrdWxpLmlvIiwic3ViIjoic2FrdWxpX2NvbnRhaW5lciJ9.wf8IkJ17_RF9shHWfSVEn3l4i-3Tz9J3S2vSmmxmne1ArArwLl4jH-ZbspGq0ovG2D6v3Fwf69zOlPtZvKnmHA";

const validator = new PluginValidator(getImageName());
try {
    validator.verifyEnvironment(getContainerToken(), getLicenseToken() || "");
    process.exit(0);
} catch (e) {
    console.warn(
        chalk`{red Failed to validate container runtime ${getImageName()}. ${e}}`
    );
    process.exit(-1);
}
