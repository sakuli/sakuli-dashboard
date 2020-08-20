import { mockPartial } from "sneer";
import http from "http";
import { CoreV1Api, V1Pod } from "@kubernetes/client-node";

export const apply = jest.fn(() => Promise.resolve(mockPartial<http.IncomingMessage>({})))
export const getPodStatus = jest.fn(() => Promise.resolve(mockPartial<V1Pod>({})))
export const deletePod = jest.fn(() => Promise.resolve())
export const createK8sClient = jest.fn(() => Promise.resolve(mockPartial<CoreV1Api>({})))