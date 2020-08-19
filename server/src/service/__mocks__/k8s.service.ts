import { K8sService } from "../k8s.service";

const applyMock = jest.fn();
const getPodStatusMock = jest.fn();
const deletePodMock = jest.fn();

export function k8sService(): K8sService{
    return{
        apply: applyMock,
        getPodStatus: getPodStatusMock,
        deletePod: deletePodMock
    }
}