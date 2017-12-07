## squid

demoregistry.dataman-inc.com/squid/openshift-kafka:0.10.1.1
demoregistry.dataman-inc.com/squid/mysql-5.7-squid-db:1.4.1
demoregistry.dataman-inc.com/squid/centos7-nginx1.12-squid-console-ue:1.4.1
demoregistry.dataman-inc.com/squid/centos7-openjdk8-squid-demo-client:1.4.1
demoregistry.dataman-inc.com/squid/centos7-openjdk8-squid-demo-server:1.4.1
demoregistry.dataman-inc.com/squid/centos7-openjdk8-squid-console:1.4.1

## octopus
"zookeeper:3.4.10"
"wurstmeister/kafka:0.11.0.1"
"demoregistry.dataman-inc.com/octopus/octopus-db:1.4.1"
"demoregistry.dataman-inc.com/octopus/centos7-nginx1.12-octopus_console:1.4.1"
"demoregistry.dataman-inc.com/octopus/centos7-openjdk8-octopus_api:1.4.1"
"demoregistry.dataman-inc.com/octopus/centos7-openjdk8-octopus_executor:1.4.1"


## push_image.sh

```
#! /bin/bash
# __author__ = f0x11

docker_repo=172.30.1.1:5000/openshift

# 定义列表
images=(
    "zookeeper:3.4.10"
    "wurstmeister/kafka:0.11.0.1"
    "demoregistry.dataman-inc.com/octopus/octopus-db:1.4.1"
    "demoregistry.dataman-inc.com/octopus/centos7-nginx1.12-octopus_console:1.4.1"
    "demoregistry.dataman-inc.com/octopus/centos7-openjdk8-octopus_api:1.4.1"
    "demoregistry.dataman-inc.com/octopus/centos7-openjdk8-octopus_executor:1.4.1"
)

# pull images
for i in ${images[@]}
do
docker pull $i
done

# tag and push
for i in ${images[@]}
do
tag=$(echo $i|awk -F "/" '{print $NF}')
image=$docker_repo/$tag
docker tag $i $image
docker push $image
done
```
