export const createOpenshiftRequest = () => {
    return {
        "apiVersion": "v1",
        "kind": "Pod",
        "metadata": {
            "labels": {
                "app": "pink-coffee"
            },
            "generateName": "pink-coffee-",
            "namespace": "pink-coffee"
        },
        "spec": {
            "containers": [
                {
                    "env": [
                        {
                            "name": "SAKULI_ENCRYPTION_KEY",
                            "valueFrom": {
                                "secretKeyRef": {
                                    "key": "key",
                                    "name": "sakuli-encryption-key"
                                }
                            }
                        }
                    ],
                    "image": "docker-registry.default.svc:5000/pink-coffee/pink-coffee",
                    "imagePullPolicy": "Always",
                    "name": "pink-coffee",
                    "resources": {},
                    "securityContext": {
                        "capabilities": {
                            "drop": [
                                "KILL",
                                "MKNOD",
                                "SETGID",
                                "SETUID"
                            ]
                        },
                        "privileged": false,
                        "runAsUser": 1000260000,
                        "seLinuxOptions": {
                            "level": "s0:c16,c10"
                        }
                    },
                    "terminationMessagePath": "/dev/termination-log",
                    "terminationMessagePolicy": "File",
                    "volumeMounts": [
                        {
                            "mountPath": "/dev/shm",
                            "name": "dshm"
                        }
                    ]
                }
            ],
            "dnsPolicy": "ClusterFirst",
            "imagePullSecrets": [
                {
                    "name": "default-dockercfg-8xx5k"
                }
            ],
            "restartPolicy": "Never",
            "securityContext": {
                "fsGroup": 1000260000,
                "seLinuxOptions": {
                    "level": "s0:c16,c10"
                }
            },
            "serviceAccount": "default",
            "serviceAccountName": "default",
            "terminationGracePeriodSeconds": 30,
            "volumes": [
                {
                    "emptyDir": {
                        "medium": "Memory"
                    },
                    "name": "dshm"
                }
            ]
        }
    }
};