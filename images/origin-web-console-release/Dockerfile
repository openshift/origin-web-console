# Adds some additional dependencies to the nodejs S2I builder so that the console integration tests
# can be run against any openshift console (server must have auth set to AllowAllPasswordIdentityProvider)
FROM openshift/nodejs-010-centos7
# install java, xvbf, and Firefox for headless browser testing with selenium
# Firefox requires a machine-id exist so just go ahead and generate a bogus one
USER root
RUN yum install -y java-1.?.0-openjdk Xvfb firefox && \
    yum clean all -y  && \
    dbus-uuidgen > /etc/machine-id
USER 1001