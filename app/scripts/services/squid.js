'use strict';

angular.module("openshiftConsole")
  .factory("SquidService", function () {
    var squidTemplate = function () {
      var importSquid = {
        "apiVersion": "v1",
        "kind": "Template",
        "labels": {
          "template": "squid-up"
        },
        "message": "Squid has been depolyed.\n\nFor more information about using this template, see https://github.com/Dataman-Cloud/squid.",
        "metadata": {
          "annotations": {
            "description": "An example Squid application with a Database database. For more information about using this template, see https://github.com/Dataman-Cloud/squid.\n\nWARNING: Any data stored will be lost upon pod destruction. Only use this template for testing.",
            "iconClass": "icon-git",
            "openshift.io/display-name": "Squid Console",
            "tags": "quickstart,squid,dataman",
            "template.openshift.io/documentation-url": "https://github.com/Dataman-Cloud/squid",
            "template.openshift.io/long-description": "This template is a squid application.  The database is stored in non-persistent storage, so this configuration should be used for experimental purposes only.",
            "template.openshift.io/provider-display-name": "Dataman, Inc.",
            "template.openshift.io/support-url": "https://github.com/Dataman-Cloud/squid"
          },
          "creationTimestamp": "2017-11-07T05:17:23Z",
          "name": "squid-up",
          "namespace": "openshift",
          "resourceVersion": "434449",
          "selfLink": "/oapi/v1/namespaces/openshift/templates/squid-up",
          "uid": "efc8c88a-c37a-11e7-91ea-005056856489"
        },
        "objects": [
          {
            "apiVersion": "v1",
            "data": {
              "regcenter.json": "[\n  {\n    \"nameAndNamespace\": \"demo/squid.dataman.com\",\n    \"zkAddressList\": \"${ZOOKEEPER_ADDRESS}:2181\",\n    \"degree\":\"1\"\n  }\n]\n"
            },
            "kind": "ConfigMap",
            "metadata": {
              "name": "${SQUID_CONFIG_NAME}"
            }
          },
          {
            "apiVersion": "v1",
            "kind": "Service",
            "metadata": {
              "annotations": {
                "description": "Exposes the squid-console server"
              },
              "name": "${SQUID_CONSOLE_NAME}"
            },
            "spec": {
              "ports": [
                {
                  "name": "squid-console",
                  "port": 9088,
                  "targetPort": 9088
                }
              ],
              "selector": {
                "name": "${SQUID_CONSOLE_NAME}"
              }
            }
          },
          {
            "apiVersion": "v1",
            "kind": "DeploymentConfig",
            "metadata": {
              "annotations": {
                "description": "Defines how to deploy the squid-console",
                "template.alpha.openshift.io/wait-for-ready": "true"
              },
              "name": "${SQUID_CONSOLE_NAME}"
            },
            "spec": {
              "replicas": 1,
              "selector": {
                "name": "${SQUID_CONSOLE_NAME}"
              },
              "strategy": {
                "type": "Recreate"
              },
              "template": {
                "metadata": {
                  "labels": {
                    "name": "${SQUID_CONSOLE_NAME}"
                  },
                  "name": "${SQUID_CONSOLE_NAME}"
                },
                "spec": {
                  "containers": [
                    {
                      "env": [
                        {
                          "name": "SQUID_LOG_LEVEL",
                          "value": "DEBUG"
                        },
                        {
                          "name": "SQUID_CONSOLE_DB_URL",
                          "value": "${SQUID_DB_SERVICE_ADDRESS}"
                        },
                        {
                          "name": "SQUID_CONSOLE_DB_USERNAME",
                          "value": "root"
                        },
                        {
                          "name": "SQUID_CONSOLE_DB_PASSWORD",
                          "valueFrom": {
                            "secretKeyRef": {
                              "key": "${SECRET_KEY}",
                              "name": "${SECRET_NAME}"
                            }
                          }
                        },
                        {
                          "name": "ORCHESTRATION_TYPE",
                          "value": "K8S"
                        },
                        {
                          "name": "SQUID_DCOS_REGISTRY_URI",
                          "value": "${SQUID_REGISTRY_URI}"
                        },
                        {
                          "name": "K8S_BASE_PATH",
                          "value": "${K8S_BASE_PATH}"
                        },
                        {
                          "name": "K8S_NAMESPACE",
                          "value": "${K8S_NAMESPACE}"
                        },
                        {
                          "name": "SQUID_CONSOLE_PORT",
                          "value": "9088"
                        },
                        {
                          "name": "OCTOPUS_SWAN_REST_URI",
                          "value": "http://10.3.8.29:5016"
                        },
                        {
                          "name": "OCTOPUS_SWAN_REST_PATH",
                          "value": "/v1/apps"
                        },
                        {
                          "name": "OCTOPUS_DCOS_USERNAME",
                          "value": "dev"
                        },
                        {
                          "name": "OCTOPUS_DCOS_PASSWORD",
                          "value": "Admin123"
                        },
                        {
                          "name": "DM_GROUP_ID",
                          "value": "4"
                        },
                        {
                          "name": "DM_TENANT_ID",
                          "value": "3"
                        },
                        {
                          "name": "DM_USER_ID",
                          "value": "9"
                        },
                        {
                          "name": "DM_USER_NAME",
                          "value": "dataman"
                        },
                        {
                          "name": "DM_VCLUSTER",
                          "value": "dataman"
                        },
                        {
                          "name": "DM_VCLUSTER_ID",
                          "value": "1"
                        },
                        {
                          "name": "DM_GROUP_NAME",
                          "value": "dataman"
                        }
                      ],
                      "image": " ",
                      "name": "squid-console",
                      "ports": [
                        {
                          "containerPort": 9088
                        }
                      ],
                      "securityContext": {
                        "runAsUser": 0
                      },
                      "volumeMounts": [
                        {
                          "mountPath": "/squid-console/regcenter.json",
                          "name": "config-volume",
                          "subPath": "regcenter.json"
                        }
                      ]
                    }
                  ],
                  "volumes": [
                    {
                      "configMap": {
                        "name": "${SQUID_CONFIG_NAME}"
                      },
                      "name": "config-volume"
                    }
                  ]
                }
              },
              "triggers": [
                {
                  "imageChangeParams": {
                    "automatic": true,
                    "containerNames": [
                      "squid-console"
                    ],
                    "from": {
                      "kind": "ImageStreamTag",
                      "name": "alpine-oraclejdk8-squid-console:1.2.3",
                      "namespace": "openshift"
                    }
                  },
                  "type": "ImageChange"
                },
                {
                  "type": "ConfigChange"
                }
              ]
            }
          },
          {
            "apiVersion": "v1",
            "kind": "Service",
            "metadata": {
              "annotations": {
                "description": "Exposes the squid-console-ue server"
              },
              "name": "${SQUID_UE_NAME}"
            },
            "spec": {
              "ports": [
                {
                  "name": "squid-ue",
                  "port": 80,
                  "targetPort": 80
                }
              ],
              "selector": {
                "name": "${SQUID_UE_NAME}"
              }
            }
          },
          {
            "apiVersion": "v1",
            "kind": "DeploymentConfig",
            "metadata": {
              "annotations": {
                "description": "Defines how to deploy the squid-console-ue",
                "template.alpha.openshift.io/wait-for-ready": "true"
              },
              "name": "${SQUID_UE_NAME}"
            },
            "spec": {
              "replicas": 1,
              "selector": {
                "name": "${SQUID_UE_NAME}"
              },
              "strategy": {
                "type": "Recreate"
              },
              "template": {
                "metadata": {
                  "labels": {
                    "name": "${SQUID_UE_NAME}"
                  },
                  "name": "${SQUID_UE_NAME}"
                },
                "spec": {
                  "containers": [
                    {
                      "env": [
                        {
                          "name": "API_URL",
                          "value": "http://${SQUID_CONSOLE_NAME}"
                        },
                        {
                          "name": "API_PORT",
                          "value": "9088"
                        }
                      ],
                      "image": " ",
                      "name": "squid-ue",
                      "ports": [
                        {
                          "containerPort": 80
                        }
                      ],
                      "securityContext": {
                        "runAsUser": 0
                      }
                    }
                  ]
                }
              },
              "triggers": [
                {
                  "imageChangeParams": {
                    "automatic": true,
                    "containerNames": [
                      "squid-ue"
                    ],
                    "from": {
                      "kind": "ImageStreamTag",
                      "name": "debian-nginx-1.13.5-quid-console-ue:1.2.3",
                      "namespace": "openshift"
                    }
                  },
                  "type": "ImageChange"
                },
                {
                  "type": "ConfigChange"
                }
              ]
            }
          },
          {
            "apiVersion": "v1",
            "kind": "Service",
            "metadata": {
              "annotations": {
                "description": "Exposes the squid-client server"
              },
              "name": "${SQUID_DEMO_CLIENT_NAME}"
            },
            "spec": {
              "ports": [
                {
                  "name": "squid-client",
                  "port": 8081,
                  "targetPort": 8081
                }
              ],
              "selector": {
                "name": "${SQUID_DEMO_CLIENT_NAME}"
              }
            }
          },
          {
            "apiVersion": "v1",
            "kind": "DeploymentConfig",
            "metadata": {
              "annotations": {
                "description": "Defines how to deploy the squid-client",
                "template.alpha.openshift.io/wait-for-ready": "true"
              },
              "name": "${SQUID_DEMO_CLIENT_NAME}"
            },
            "spec": {
              "replicas": 1,
              "selector": {
                "name": "${SQUID_DEMO_CLIENT_NAME}"
              },
              "strategy": {
                "type": "Recreate"
              },
              "template": {
                "metadata": {
                  "labels": {
                    "name": "${SQUID_DEMO_CLIENT_NAME}"
                  },
                  "name": "${SQUID_DEMO_CLIENT_NAME}"
                },
                "spec": {
                  "containers": [
                    {
                      "env": [
                        {
                          "name": "SQUID_ZK_ADDRESS",
                          "value": "${ZOOKEEPER_ADDRESS}:2181"
                        },
                        {
                          "name": "SQUID_SERVICE_NAMESPACE",
                          "value": "squid.dataman.com"
                        },
                        {
                          "name": "SQUID_KAFKA_CLUSTER_NAME",
                          "value": "kafka"
                        }
                      ],
                      "image": " ",
                      "name": "squid-client",
                      "ports": [
                        {
                          "containerPort": 8081
                        }
                      ],
                      "securityContext": {
                        "runAsUser": 0
                      }
                    }
                  ]
                }
              },
              "triggers": [
                {
                  "imageChangeParams": {
                    "automatic": true,
                    "containerNames": [
                      "squid-client"
                    ],
                    "from": {
                      "kind": "ImageStreamTag",
                      "name": "alpine-oraclejdk8-squid-demo-client:1.2.3",
                      "namespace": "openshift"
                    }
                  },
                  "type": "ImageChange"
                },
                {
                  "type": "ConfigChange"
                }
              ]
            }
          },
          {
            "apiVersion": "v1",
            "kind": "Service",
            "metadata": {
              "annotations": {
                "description": "Exposes the squid-server server"
              },
              "name": "${SQUID_DEMO_SERVER_NAME}"
            },
            "spec": {
              "ports": [
                {
                  "name": "squid-server",
                  "port": 39011,
                  "targetPort": 39011
                }
              ],
              "selector": {
                "name": "${SQUID_DEMO_SERVER_NAME}"
              }
            }
          },
          {
            "apiVersion": "v1",
            "kind": "DeploymentConfig",
            "metadata": {
              "annotations": {
                "description": "Defines how to deploy the squid-client",
                "template.alpha.openshift.io/wait-for-ready": "true"
              },
              "name": "${SQUID_DEMO_SERVER_NAME}"
            },
            "spec": {
              "replicas": 1,
              "selector": {
                "name": "${SQUID_DEMO_SERVER_NAME}"
              },
              "strategy": {
                "type": "Recreate"
              },
              "template": {
                "metadata": {
                  "labels": {
                    "name": "${SQUID_DEMO_SERVER_NAME}"
                  },
                  "name": "${SQUID_DEMO_SERVER_NAME}"
                },
                "spec": {
                  "containers": [
                    {
                      "command": [
                        "/bin/sh",
                        "/squid-executor/bin/squid-executor.sh",
                        "start",
                        "-n",
                        "squid.dataman.com",
                        "-r",
                        "foreground",
                        "-env",
                        "docker",
                        "-d",
                        "/squid-executor/apps/app"
                      ],
                      "env": [
                        {
                          "name": "SQUID_LOG_LEVEL",
                          "value": "DEBUG"
                        },
                        {
                          "name": "SQUID_ZK_CONNECTION",
                          "value": "${ZOOKEEPER_ADDRESS}:2181"
                        },
                        {
                          "name": "AUTO_COMMIT_INTERVAL_MS",
                          "value": "1000"
                        },
                        {
                          "name": "SQUID_METRICS_PORT",
                          "value": "39011"
                        },
                        {
                          "name": "SQUID_DISABLE_METRICS",
                          "value": "false"
                        },
                        {
                          "name": "AUTH_SECRET",
                          "value": "123457"
                        }
                      ],
                      "image": " ",
                      "name": "squid-server",
                      "ports": [
                        {
                          "containerPort": 39011
                        }
                      ],
                      "securityContext": {
                        "runAsUser": 0
                      }
                    }
                  ]
                }
              },
              "triggers": [
                {
                  "imageChangeParams": {
                    "automatic": true,
                    "containerNames": [
                      "squid-server"
                    ],
                    "from": {
                      "kind": "ImageStreamTag",
                      "name": "alpine-oraclejdk8-squid-demo-server:1.2.3",
                      "namespace": "openshift"
                    }
                  },
                  "type": "ImageChange"
                },
                {
                  "type": "ConfigChange"
                }
              ]
            }
          }
        ],
        "parameters": [
          {
            "displayName": "SECRET NAME",
            "name": "SECRET_NAME",
            "required": true,
            "value": "squid"
          },
          {
            "displayName": "SECRET KEY",
            "name": "SECRET_KEY",
            "required": true,
            "value": "database-root-password"
          },
          {
            "displayName": "Squid Config Name",
            "name": "SQUID_CONFIG_NAME",
            "required": true,
            "value": "squid-config"
          },
          {
            "displayName": "Squid Console Name",
            "name": "SQUID_CONSOLE_NAME",
            "required": true,
            "value": "squid-console"
          },
          {
            "displayName": "Squid UE Name",
            "name": "SQUID_UE_NAME",
            "required": true,
            "value": "squid-ue"
          },
          {
            "displayName": "Squid Demo Client Name",
            "name": "SQUID_DEMO_CLIENT_NAME",
            "required": true,
            "value": "squid-demo-client"
          },
          {
            "displayName": "Squid Demo Server Name",
            "name": "SQUID_DEMO_SERVER_NAME",
            "required": true,
            "value": "squid-demo-server"
          },
          {
            "displayName": "Zookeeper Address",
            "name": "ZOOKEEPER_ADDRESS",
            "required": true,
            "value": "kafka-zk"
          },
          {
            "displayName": "Squid DB Address",
            "name": "SQUID_DB_SERVICE_ADDRESS",
            "required": true,
            "value": "jdbc:mysql://squid-db:3306/squid_console"
          },
          {
            "displayName": "Squid Registry URI",
            "name": "SQUID_REGISTRY_URI",
            "required": true,
            "value": "http://192.168.1.140:5000"
          },
          {
            "displayName": "K8S URI",
            "name": "K8S_BASE_PATH",
            "required": true,
            "value": "http://192.168.1.140:8001"
          },
          {
            "displayName": "Project Name",
            "name": "K8S_NAMESPACE",
            "required": true,
            "value": "squid"
          }
        ]
      }

      return importSquid
    };

    return {
      squidTemplate: squidTemplate
    };
  });
