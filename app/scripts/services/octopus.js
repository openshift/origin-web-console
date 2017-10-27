'use strict';

angular.module("openshiftConsole")
  .factory("OctopusService", function ($filter, ApplicationGenerator, DataService) {
    // maps an env object: { key: 'val', key2: 'val2'}
    // to an array: [{},{},{}]

    var findServiceV1 = function (data) {
      var importService = {
        apiVersion: "v1",
        kind: "Service",
        metadata: {
          annotations: {
            description: "Exposes the Octopus Console"
          },
          labels: {
            app: data.APP_NAME
          },
          name: data.OCTOPUS_CONSOLE_NAME
        },
        spec: {
          ports: [
            {
              name: "octopus",
              port: 80,
              targetPort: 18080
            }
          ],
          selector: {
            name: data.OCTOPUS_CONSOLE_NAME
          }
        }
      }
      return importService
    }
    var findDeploymentConfigV1 = function (data) {
      var impostDeploymentConfig = {
        apiVersion: "v1",
        kind: "DeploymentConfig",
        metadata: {
          annotations: {
            description: "Defines how to deploy the Octopus Console",
            'template.alpha.openshift.io/wait-for-ready': "true"
          },
          labels: {
            app: data.APP_NAME
          },
          name: data.OCTOPUS_CONSOLE_NAME
        },
        spec: {
          replicas: 1,
          selector: {
            name: data.OCTOPUS_CONSOLE_NAME
          },
          strategy: {
            type: "Recreate"
          },
          template: {
            metadata: {
              labels: {
                name: data.OCTOPUS_CONSOLE_NAME
              },
              name: data.OCTOPUS_CONSOLE_NAME
            },
            spec: {
              containers: [
                {
                  env: [
                    {
                      name: "API_URL",
                      value: 'http://' + data.OCTOPUS_API_NAME
                    },
                    {
                      name: "API_PORT",
                      value: "9088"
                    }
                  ],
                  image: " ",
                  name: data.OCTOPUS_CONSOLE_NAME,
                  ports: [
                    {
                      containerPort: 18080
                    }
                  ]
                }
              ]
            }
          },
          triggers: [
            {
              imageChangeParams: {
                automatic: true,
                containerNames: [
                  data.OCTOPUS_CONSOLE_NAME
                ],
                from: {
                  kind: "ImageStreamTag",
                  name: "centos7-nginx1.12-octopus_console:1.3.0-RC1",
                  namespace: "openshift"
                }
              },
              type: "ImageChange"
            },
            {
              type: "ConfigChange"
            }
          ]
        }
      }
      return impostDeploymentConfig
    }

    var findServiceV2 = function (data) {
      var importServiceV2 = {
        apiVersion: "v1",
        kind: "Service",
        metadata: {
          annotations: {
            description: "Exposes the API"
          },
          labels: {
            app: data.APP_NAME
          },
          name: data.OCTOPUS_API_NAME
        },
        spec: {
          ports: [
            {
              name: "api",
              port: 9088,
              targetPort: 9088
            }
          ],
          selector: {
            name: data.OCTOPUS_API_NAME
          }
        }
      }
      return importServiceV2
    }

    var findDeploymentConfigV2 = function (data) {
      var impostDeploymentConfigV2 = {
        apiVersion: "v1",
        kind: "DeploymentConfig",
        metadata: {
          annotations: {
            description: "Defines how to deploy the Octopus API",
            'template.alpha.openshift.io/wait-for-ready': "true"
          },
          labels: {
            app: data.APP_NAME
          },
          name: data.OCTOPUS_API_NAME
        },
        spec: {
          replicas: 1,
          selector: {
            name: data.OCTOPUS_API_NAME
          },
          strategy: {
            type: "Recreate"
          },
          template: {
            metadata: {
              labels: {
                name: data.OCTOPUS_API_NAME
              },
              name: data.OCTOPUS_API_NAME
            },
            spec: {
              containers: [
                {
                  env: [
                    {
                      name: "SPRING_DATASOURCE_URL",
                      value: data.SPRING_DATASOURCE_JDBC
                    },
                    {
                      name: "SPRING_DATASOURCE_USERNAME",
                      value: "root"
                    },
                    {
                      name: "SPRING_DATASOURCE_PASSWORD",
                      valueFrom: {
                        secretKeyRef: {
                          key: data.SECRET_KEY,
                          name: data.SECRET_NAME
                        }
                      }
                    },
                    {
                      name: "OCTOPUS_CLOUD_containerType",
                      value: "K8S"
                    },
                    {
                      name: "OCTOPUS_CLOUD_registryUri",
                      value: data.REGISTRY_URI
                    },
                    {
                      name: "OCTOPUS_CLOUD_K8S_restUri",
                      value: data.K8S_URI
                    },
                    {
                      name: "OCTOPUS_CLOUD_K8S_NAMESPACE",
                      value: data.NAMESPACE
                    }
                  ],
                  command: ["java", "-Dkubernetes.auth.tryKubeConfig=false", "-Dkubernetes.auth.tryServiceAccount=false", "-Dkubernetes.tryNamespacePath=false", "-Dlogging.level.io.fabric8=DEBUG", "-Djava.security.egd=file:/dev/./urandom" , "-jar", "octopus-api.jar"],
                  image: " ",
                  name: data.OCTOPUS_API_NAME,
                  ports: [
                    {
                      containerPort: 9088
                    }
                  ]
                }
              ]
            }
          },
          triggers: [
            {
              imageChangeParams: {
                automatic: true,
                containerNames: [
                  data.OCTOPUS_API_NAME
                ],
                from: {
                  kind: "ImageStreamTag",
                  name: "centos7-openjdk8-octopus_api:1.3.0-RC1",
                  namespace: "openshift"
                }
              },
              type: "ImageChange"
            },
            {
              type: "ConfigChange"
            }
          ]
        }
      }
      return impostDeploymentConfigV2
    }

    return {
      findServiceV1: findServiceV1,
      findDeploymentConfigV1: findDeploymentConfigV1,
      findServiceV2: findServiceV2,
      findDeploymentConfigV2: findDeploymentConfigV2
    };
  })
