import { V1Pod } from "@kubernetes/client-node";

interface PodDescriptor{
    actionIdentifier: string
    pod: V1Pod
}

let activePods: PodDescriptor[] = []

function getActivePods(): PodDescriptor[]{
    return activePods
}

function registerPod(podDescriptor: PodDescriptor){
    activePods.push(podDescriptor)
}

function deletePod(podDescriptor: PodDescriptor){
    const index = activePods.indexOf(podDescriptor);
    if (index > -1) {
        activePods = activePods.splice(index, 1);
    }
}

export const PodRegistry = {
    getActivePods,
    registerPod,
    deletePod
}