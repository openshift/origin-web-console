Web Console Test Data
=====================

The file `overview-edge-cases.yaml` contains resources to test various edge
cases handled by the overview page. To load the test data, run the commands

```
$ oc new-project test-data
$ oc create -f overview-edge-cases.yaml
```

Alternatively, you can import the YAML file from the Add to Project page in the
web console itself.

Additional test data files can be found in the origin repository

<https://github.com/openshift/origin/tree/master/test/testdata/app-scenarios>
