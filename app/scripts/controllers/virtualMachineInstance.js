'use strict';

angular.module('openshiftConsole')
  .controller('VirtualMachineInstanceController', function ($filter,
                                         $routeParams,
                                         $scope,
                                         APIService,
                                         DataService,
                                         Navigate,
                                         MetricsService,
                                         ProjectsService,
                                         KubevirtVersions,
                                         VmHelpers) {
    $scope.projectName = $routeParams.project;
    $scope.alerts = {};
    $scope.logOptions = {};
    $scope.breadcrumbs = [
      {
        title: 'Virtual Machines',
        link: Navigate.resourceListURL(KubevirtVersions.virtualMachine.resource, $routeParams.project)
      },
      {
        title: $routeParams.vm,
        link: Navigate.resourceURL($routeParams.vm, KubevirtVersions.virtualMachine.kind, $routeParams.project)
      },
      {
        title: 'Virtual Machines Instance'
      }
    ];

    // Must always be initialized so we can watch selectedTab
    $scope.selectedTab = {};
    $scope.vmi = undefined;
    $scope.ovm = undefined;
    $scope.pods = []; // sorted by creation time, the most recent first
    $scope.loaded = function () {
      return $scope.vmiLoaded && $scope.vmLoaded && $scope.podsLoaded;
    };

    $scope.podsVersion = APIService.getPreferredVersion('pods');
    $scope.eventsVersion = APIService.getPreferredVersion('events');
    $scope.KubevirtVersions = KubevirtVersions;
    $scope.Navigate = Navigate;

    // Check if the metrics service is available so we know when to show the tab.
    MetricsService.isAvailable().then(function(available) {
      $scope.metricsAvailable = available;
    });

    var watches = [];
    var requestContext = null;

    var allPods = {}; // {[podName: string]: Pod}

    function updatePods() {
      if (!$scope.vmi) {
        $scope.pods = [];
        return;
      }
      $scope.pods = VmHelpers.filterVmiPods(allPods, $scope.vmi.metadata.name);
    }

    var vmiLoadingError;

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        requestContext = context;
        $scope.project = project;
        $scope.projectContext = context;

        DataService
          .get(KubevirtVersions.virtualMachineInstance, $routeParams.vm, context, { errorNotification: false })
          .then(function (vm) {
            $scope.vmi = vm;
            $scope.vmiLoaded = true;
            updatePods();
          }, function (error) {
            $scope.vmiLoaded = true;
            vmiLoadingError = error;
            updateLoadingAlert();
          });

        DataService
          .get(KubevirtVersions.virtualMachine, $routeParams.vm, context, { errorNotification: false })
          .then(function (vm) {
            $scope.vm = vm;
            $scope.vmLoaded = true;
          }, function () {
            $scope.vmLoaded = true;
          });

        watches.push(DataService.watchObject(KubevirtVersions.virtualMachineInstance, $routeParams.vm, context, function(vmi, action) {
          $scope.vmi = action === 'DELETED' ? undefined : vmi;
          updatePods();
          vmiLoadingError = undefined;
          updateLoadingAlert();
        }));

        watches.push(DataService.watchObject(KubevirtVersions.virtualMachine, $routeParams.vm, context, function(vm, action) {
          $scope.vm = action === 'DELETED' ? undefined : vm;
        }));

        watches.push(DataService.watch($scope.podsVersion, context, function(result) {
          $scope.podsLoaded = true;
          allPods = result.by('metadata.name');
          updatePods();
        }));

        function updateLoadingAlert() {
          if (vmiLoadingError) {
            $scope.alerts.load = {
              type: 'error',
              message: 'The virtual machine instance detail could not be loaded.',
              details: $filter('getErrorDetails')(vmiLoadingError)
            };
          } else {
            delete $scope.alerts.load;
          }
          if (!$scope.vmi && !vmiLoadingError) {
            $scope.alerts.deleted = {
              type: 'warning',
              message: 'The virtual machine instance ' + $routeParams.vm + ' has been deleted.'
            };
          } else {
            delete $scope.alerts.deleted;
          }
        }

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });
    }));
  });

angular.module('openshiftConsole')
  .filter('ovmReference', function () {
    return function (vm) {
      return _(_.get(vm, 'metadata.ownerReferences'))
        .filter({ kind: 'OfflineVirtualMachine'})
        .first();
    };
  });

angular.module('openshiftConsole')
  .factory('VmActions', [
    'DataService',
    'KubevirtVersions',
    function (DataService, KubevirtVersions) {

    function setVmRunning(vm, running, context) {
      var updatedVm = angular.copy(vm);
      updatedVm.spec.running = running;
      DataService.update(
        KubevirtVersions.virtualMachine.resource,
        vm.metadata.name,
        updatedVm,
        context
      );
    }

    return {
      start: function (vm, context) {
        setVmRunning(vm, true, context);
      },
      restart: function (vmi, context) {
        DataService.delete(
          KubevirtVersions.virtualMachineInstance,
          vmi.metadata.name,
          context
        );
      },
      stop: function (vm, context) {
        setVmRunning(vm, false, context);
      },
      canStart: function (vm) {
        return vm && _.get(vm, 'spec.running') !== true;
      },
      canRestart: function (vmi, vm) {
        return vmi && vm;
      },
      canStop: function (vm) {
        return _.get(vm, 'spec.running') === true;
      },
    };
  }]);

angular.module('openshiftConsole')
  .component('vmActionsLine', {
    bindings: {
      vmi: '<',
      vm: '<',
      context: '<'
    },
    templateUrl: 'views/directives/vm-actions-line.html',
    controller: ['VmActions', function (VmActions) {
      this.VmActions = VmActions;
    }]
  });

angular.module('openshiftConsole')
  .filter('vmStateText', function () {
    return function (vmi, vm) {
      var vmPhase = _.get(vmi, 'status.phase');
      if (vmPhase !== undefined) {
        return vmPhase;
      }
      if (_.get(vm, 'spec.running') === false) {
        return "Not Running";
      }
      return "Unknown";
    };
  });

angular.module('openshiftConsole')
  .filter('vmMemory', function () {
    return function (vmi) {
      return _.get(vmi, 'spec.domain.resources.requests.memory');
    };
  });

angular.module('openshiftConsole')
  .filter('vmCpu', function () {
    return function (vmi) {
      return _.get(vmi, 'spec.domain.cpu.cores');
    };
  });

angular.module('openshiftConsole')
  .filter('vmOs', function () {
    return function (vmi) {
      return _.get(vmi, 'metadata.labels["kubevirt.io/os"]');
    };
  });

angular.module('openshiftConsole')
  .filter('orDashes', function () {
    return function (input) {
      return input === undefined ? '--' : input;
    };
  });

angular.module('openshiftConsole')
  .filter('orDefault', function () {
    return function (input) {
      return input === undefined ? 'Default' : input;
    };
  });

angular.module('openshiftConsole')
  .directive('vmState', function () {
    return {
      scope: {
        state: '<',
      },
      template: '<vm-state-icon state="state"></vm-state-icon> {{state}}'
    };
  });

angular.module('openshiftConsole')
  .directive('vmStateIcon', function () {
    return {
      scope: {
        state: '<',
      },
      templateUrl: 'views/directives/vm-state-icon.html'
    };
  });

/*
Script generating the os database:

#!/usr/bin/env node
const cp = require('child_process')
console.log('//', cp.execFileSync('rpm', ['-q', 'osinfo-db'], { encoding: 'utf8' }).trim())
const osinfoOutput = cp.execFileSync('osinfo-query', ['os'], { encoding: 'utf8' })
const lines = osinfoOutput.trim().split('\n')
const validLines = lines.slice(2)
const result = validLines
  .map(line => line.match(/^([^|]+)\|([^|]+)\|/))
  .filter(line => line)
  .reduce((accum, splitResult) => {
      const osId = splitResult[1].trim()
      const osName = splitResult[2].trim()
      accum[osId] = osName
      return accum
    }, {})
console.log('var osIdToName =', result)
 */
angular.module('openshiftConsole')
  .filter('humanizeOs', function () {
    return function (osinfoId) {
      // osinfo-db-20180502-1.fc27.noarch
      var osIdToName = {
        'alpinelinux3.5': 'Alpine Linux 3.5',
        'alpinelinux3.6': 'Alpine Linux 3.6',
        'alpinelinux3.7': 'Alpine Linux 3.7',
        'altlinux1.0': 'Mandrake RE Spring 2001',
        'altlinux2.0': 'ALT Linux 2.0',
        'altlinux2.2': 'ALT Linux 2.2',
        'altlinux2.4': 'ALT Linux 2.4',
        'altlinux3.0': 'ALT Linux 3.0',
        'altlinux4.0': 'ALT Linux 4.0',
        'altlinux4.1': 'ALT Linux 4.1',
        'altlinux5.0': 'ALT Linux 5.0',
        'altlinux6.0': 'ALT Linux 6.0',
        'altlinux7.0': 'ALT Linux 7.0',
        'asianux-unknown': 'Asianux unknown',
        'asianux4.6': 'Asianux Server 4 SP6',
        'asianux4.7': 'Asianux Server 4 SP7',
        'asianux7.0': 'Asianux Server 7',
        'asianux7.1': 'Asianux Server 7 SP1',
        'asianux7.2': 'Asianux Server 7 SP2',
        'centos6.0': 'CentOS 6.0',
        'centos6.1': 'CentOS 6.1',
        'centos6.2': 'CentOS 6.2',
        'centos6.3': 'CentOS 6.3',
        'centos6.4': 'CentOS 6.4',
        'centos6.5': 'CentOS 6.5',
        'centos6.6': 'CentOS 6.6',
        'centos6.7': 'CentOS 6.7',
        'centos6.8': 'CentOS 6.8',
        'centos6.9': 'CentOS 6.9',
        'centos7.0': 'CentOS 7.0',
        'debian1.1': 'Debian Buzz',
        'debian1.2': 'Debian Rex',
        'debian1.3': 'Debian Bo',
        'debian2.0': 'Debian Hamm',
        'debian2.1': 'Debian Slink',
        'debian2.2': 'Debian Potato',
        debian3: 'Debian Woody',
        'debian3.1': 'Debian Sarge',
        debian4: 'Debian Etch',
        debian5: 'Debian Lenny',
        debian6: 'Debian Squeeze',
        debian7: 'Debian Wheezy',
        debian8: 'Debian Jessie',
        debian9: 'Debian Stretch',
        debiantesting: 'Debian Testing',
        'eos3.3': 'Endless OS 3.3',
        'fedora-unknown': 'Fedora',
        fedora1: 'Fedora Core 1',
        fedora10: 'Fedora 10',
        fedora11: 'Fedora 11',
        fedora12: 'Fedora 12',
        fedora13: 'Fedora 13',
        fedora14: 'Fedora 14',
        fedora15: 'Fedora 15',
        fedora16: 'Fedora 16',
        fedora17: 'Fedora 17',
        fedora18: 'Fedora 18',
        fedora19: 'Fedora 19',
        fedora2: 'Fedora Core 2',
        fedora20: 'Fedora 20',
        fedora21: 'Fedora 21',
        fedora22: 'Fedora 22',
        fedora23: 'Fedora 23',
        fedora24: 'Fedora 24',
        fedora25: 'Fedora 25',
        fedora26: 'Fedora 26',
        fedora27: 'Fedora 27',
        fedora3: 'Fedora Core 3',
        fedora4: 'Fedora Core 4',
        fedora5: 'Fedora Core 5',
        fedora6: 'Fedora Core 6',
        fedora7: 'Fedora 7',
        fedora8: 'Fedora 8',
        fedora9: 'Fedora 9',
        'freebsd1.0': 'FreeBSD 1.0',
        'freebsd10.0': 'FreeBSD 10.0',
        'freebsd10.1': 'FreeBSD 10.1',
        'freebsd10.2': 'FreeBSD 10.2',
        'freebsd10.3': 'FreeBSD 10.3',
        'freebsd10.4': 'FreeBSD 10.4',
        'freebsd11.0': 'FreeBSD 11.0',
        'freebsd11.1': 'FreeBSD 11.1',
        'freebsd2.0': 'FreeBSD 2.0',
        'freebsd2.0.5': 'FreeBSD 2.0.5',
        'freebsd2.2.8': 'FreeBSD 2.2.8',
        'freebsd2.2.9': 'FreeBSD 2.2.9',
        'freebsd3.0': 'FreeBSD 3.0',
        'freebsd3.2': 'FreeBSD 3.2',
        'freebsd4.0': 'FreeBSD 4.0',
        'freebsd4.1': 'FreeBSD 4.1',
        'freebsd4.10': 'FreeBSD 4.10',
        'freebsd4.11': 'FreeBSD 4.11',
        'freebsd4.2': 'FreeBSD 4.2',
        'freebsd4.3': 'FreeBSD 4.3',
        'freebsd4.4': 'FreeBSD 4.4',
        'freebsd4.5': 'FreeBSD 4.5',
        'freebsd4.6': 'FreeBSD 4.6',
        'freebsd4.7': 'FreeBSD 4.7',
        'freebsd4.8': 'FreeBSD 4.8',
        'freebsd4.9': 'FreeBSD 4.9',
        'freebsd5.0': 'FreeBSD 5.0',
        'freebsd5.1': 'FreeBSD 5.1',
        'freebsd5.2': 'FreeBSD 5.2',
        'freebsd5.2.1': 'FreeBSD 5.2.1',
        'freebsd5.3': 'FreeBSD 5.3',
        'freebsd5.4': 'FreeBSD 5.4',
        'freebsd5.5': 'FreeBSD 5.5',
        'freebsd6.0': 'FreeBSD 6.0',
        'freebsd6.1': 'FreeBSD 6.1',
        'freebsd6.2': 'FreeBSD 6.2',
        'freebsd6.3': 'FreeBSD 6.3',
        'freebsd6.4': 'FreeBSD 6.4',
        'freebsd7.0': 'FreeBSD 7.0',
        'freebsd7.1': 'FreeBSD 7.1',
        'freebsd7.2': 'FreeBSD 7.2',
        'freebsd7.3': 'FreeBSD 7.3',
        'freebsd7.4': 'FreeBSD 7.4',
        'freebsd8.0': 'FreeBSD 8.0',
        'freebsd8.1': 'FreeBSD 8.1',
        'freebsd8.2': 'FreeBSD 8.2',
        'freebsd8.3': 'FreeBSD 8.3',
        'freebsd8.4': 'FreeBSD 8.4',
        'freebsd9.0': 'FreeBSD 9.0',
        'freebsd9.1': 'FreeBSD 9.1',
        'freebsd9.2': 'FreeBSD 9.2',
        'freebsd9.3': 'FreeBSD 9.3',
        'freedos1.2': 'FreeDOS 1.2',
        'gnome-continuous-3.10': 'GNOME 3.10',
        'gnome-continuous-3.12': 'GNOME 3.12',
        'gnome-continuous-3.14': 'GNOME 3.14',
        'gnome3.6': 'GNOME 3.6',
        'gnome3.8': 'GNOME 3.8',
        'macosx10.0': 'MacOS X Cheetah',
        'macosx10.1': 'MacOS X Puma',
        'macosx10.2': 'MacOS X Jaguar',
        'macosx10.3': 'MacOS X Panther',
        'macosx10.4': 'MacOS X Tiger',
        'macosx10.5': 'MacOS X Leopard',
        'macosx10.6': 'MacOS X Snow Leopard',
        'macosx10.7': 'MacOS X Lion',
        mageia1: 'Mageia 1',
        mageia2: 'Mageia 2',
        mageia3: 'Mageia 3',
        mageia4: 'Mageia 4',
        mageia5: 'Mageia 5',
        mageia6: 'Mageia 6',
        'mandrake10.0': 'Mandrake Linux 10.0',
        'mandrake10.1': 'Mandrake Linux 10.1',
        'mandrake10.2': 'Mandrake Linux 10.2',
        'mandrake5.1': 'Mandrake Linux 5.1',
        'mandrake5.2': 'Mandrake Linux 5.2',
        'mandrake5.3': 'Mandrake Linux 5.3',
        'mandrake6.0': 'Mandrake Linux 6.0',
        'mandrake6.1': 'Mandrake Linux 6.1',
        'mandrake7.0': 'Mandrake Linux 7.0',
        'mandrake7.1': 'Mandrake Linux 7.1',
        'mandrake7.2': 'Mandrake Linux 7.2',
        'mandrake8.0': 'Mandrake Linux 8.0',
        'mandrake8.1': 'Mandrake Linux 8.1',
        'mandrake8.2': 'Mandrake Linux 8.2',
        'mandrake9.0': 'Mandrake Linux 9.0',
        'mandrake9.1': 'Mandrake Linux 9.1',
        'mandrake9.2': 'Mandrake Linux 9.2',
        'mandriva2006.0': 'Mandriva Linux 2006.0',
        mandriva2007: 'Mandriva Linux 2007',
        'mandriva2007.1': 'Mandriva Linux 2007 Spring',
        'mandriva2008.0': 'Mandriva Linux 2008',
        'mandriva2008.1': 'Mandriva Linux 2008 Spring',
        'mandriva2009.0': 'Mandriva Linux 2009',
        'mandriva2009.1': 'Mandriva Linux 2009 Spring',
        'mandriva2010.0': 'Mandriva Linux 2010',
        'mandriva2010.1': 'Mandriva Linux 2010 Spring',
        'mandriva2010.2': 'Mandriva Linux 2010.2',
        mandriva2011: 'Mandriva Linux 2011',
        'mbs1.0': 'Mandriva Business Server 1.0',
        mes5: 'Mandriva Enterprise Server 5.0',
        'mes5.1': 'Mandriva Enterprise Server 5.1',
        'msdos6.22': 'Microsoft MS-DOS 6.22',
        'netbsd0.8': 'NetBSD 0.8',
        'netbsd0.9': 'NetBSD 0.9',
        'netbsd1.0': 'NetBSD 1.0',
        'netbsd1.1': 'NetBSD 1.1',
        'netbsd1.2': 'NetBSD 1.2',
        'netbsd1.3': 'NetBSD 1.3',
        'netbsd1.4': 'NetBSD 1.4',
        'netbsd1.5': 'NetBSD 1.5',
        'netbsd1.6': 'NetBSD 1.6',
        'netbsd2.0': 'NetBSD 2.0',
        'netbsd3.0': 'NetBSD 3.0',
        'netbsd4.0': 'NetBSD 4.0',
        'netbsd5.0': 'NetBSD 5.0',
        'netbsd5.1': 'NetBSD 5.1',
        'netbsd6.0': 'NetBSD 6.0',
        'netbsd6.1': 'NetBSD 6.1',
        'netbsd7.0': 'NetBSD 7.0',
        'netbsd7.1': 'NetBSD 7.1',
        'netbsd7.1.1': 'NetBSD 7.1.1',
        netware4: 'Novell Netware 4',
        netware5: 'Novell Netware 5',
        netware6: 'Novell Netware 6',
        'openbsd4.2': 'OpenBSD 4.2',
        'openbsd4.3': 'OpenBSD 4.3',
        'openbsd4.4': 'OpenBSD 4.4',
        'openbsd4.5': 'OpenBSD 4.5',
        'openbsd4.8': 'OpenBSD 4.8',
        'openbsd4.9': 'OpenBSD 4.9',
        'openbsd5.0': 'OpenBSD 5.0',
        'openbsd5.1': 'OpenBSD 5.1',
        'openbsd5.2': 'OpenBSD 5.2',
        'openbsd5.3': 'OpenBSD 5.3',
        'openbsd5.4': 'OpenBSD 5.4',
        'openbsd5.5': 'OpenBSD 5.5',
        'openbsd5.6': 'OpenBSD 5.6',
        'openbsd5.7': 'OpenBSD 5.7',
        'openbsd5.8': 'OpenBSD 5.8',
        'openbsd5.9': 'OpenBSD 5.9',
        'openbsd6.0': 'OpenBSD 6.0',
        'openbsd6.1': 'OpenBSD 6.1',
        'openbsd6.2': 'OpenBSD 6.2',
        'openbsd6.3': 'OpenBSD 6.3',
        'opensolaris2009.06': 'OpenSolaris 2009.06',
        'opensuse-factory': 'openSUSE',
        'opensuse-unknown': 'openSUSE',
        'opensuse10.2': 'openSUSE 10.2',
        'opensuse10.3': 'openSUSE 10.3',
        'opensuse11.0': 'openSUSE 11.0',
        'opensuse11.1': 'openSUSE 11.1',
        'opensuse11.2': 'openSUSE 11.2',
        'opensuse11.3': 'openSUSE 11.3',
        'opensuse11.4': 'openSUSE 11.4',
        'opensuse12.1': 'openSUSE 12.1',
        'opensuse12.2': 'openSUSE 12.2',
        'opensuse12.3': 'openSUSE 12.3',
        'opensuse13.1': 'openSUSE 13.1',
        'opensuse13.2': 'openSUSE 13.2',
        'opensuse42.1': 'openSUSE Leap 42.1',
        'opensuse42.2': 'openSUSE Leap 42.2',
        'opensuse42.3': 'openSUSE Leap 42.3',
        opensusetumbleweed: 'openSUSE Tumbleweed',
        'popos17.10': 'Pop!_OS 17.10',
        'rhel-atomic-7.0': 'Red Hat Enterprise Linux Atomic Host 7.0',
        'rhel-atomic-7.1': 'Red Hat Enterprise Linux Atomic Host 7.1',
        'rhel-atomic-7.2': 'Red Hat Enterprise Linux Atomic Host 7.2',
        'rhel2.1': 'Red Hat Enterprise Linux 2.1',
        'rhel2.1.1': 'Red Hat Enterprise Linux 2.1 Update 1',
        'rhel2.1.2': 'Red Hat Enterprise Linux 2.1 Update 2',
        'rhel2.1.3': 'Red Hat Enterprise Linux 2.1 Update 3',
        'rhel2.1.4': 'Red Hat Enterprise Linux 2.1 Update 4',
        'rhel2.1.5': 'Red Hat Enterprise Linux 2.1 Update 5',
        'rhel2.1.6': 'Red Hat Enterprise Linux 2.1 Update 6',
        'rhel2.1.7': 'Red Hat Enterprise Linux 2.1 Update 7',
        rhel3: 'Red Hat Enterprise Linux 3',
        'rhel3.1': 'Red Hat Enterprise Linux 3 Update 1',
        'rhel3.2': 'Red Hat Enterprise Linux 3 Update 2',
        'rhel3.3': 'Red Hat Enterprise Linux 3 Update 3',
        'rhel3.4': 'Red Hat Enterprise Linux 3 Update 4',
        'rhel3.5': 'Red Hat Enterprise Linux 3 Update 5',
        'rhel3.6': 'Red Hat Enterprise Linux 3 Update 6',
        'rhel3.7': 'Red Hat Enterprise Linux 3 Update 7',
        'rhel3.8': 'Red Hat Enterprise Linux 3 Update 8',
        'rhel3.9': 'Red Hat Enterprise Linux 3 Update 9',
        'rhel4.0': 'Red Hat Enterprise Linux 4.0',
        'rhel4.1': 'Red Hat Enterprise Linux 4.1',
        'rhel4.2': 'Red Hat Enterprise Linux 4.2',
        'rhel4.3': 'Red Hat Enterprise Linux 4.3',
        'rhel4.4': 'Red Hat Enterprise Linux 4.4',
        'rhel4.5': 'Red Hat Enterprise Linux 4.5',
        'rhel4.6': 'Red Hat Enterprise Linux 4.6',
        'rhel4.7': 'Red Hat Enterprise Linux 4.7',
        'rhel4.8': 'Red Hat Enterprise Linux 4.8',
        'rhel4.9': 'Red Hat Enterprise Linux 4.9',
        'rhel5.0': 'Red Hat Enterprise Linux 5.0',
        'rhel5.1': 'Red Hat Enterprise Linux 5.1',
        'rhel5.10': 'Red Hat Enterprise Linux 5.10',
        'rhel5.11': 'Red Hat Enterprise Linux 5.11',
        'rhel5.2': 'Red Hat Enterprise Linux 5.2',
        'rhel5.3': 'Red Hat Enterprise Linux 5.3',
        'rhel5.4': 'Red Hat Enterprise Linux 5.4',
        'rhel5.5': 'Red Hat Enterprise Linux 5.5',
        'rhel5.6': 'Red Hat Enterprise Linux 5.6',
        'rhel5.7': 'Red Hat Enterprise Linux 5.7',
        'rhel5.8': 'Red Hat Enterprise Linux 5.8',
        'rhel5.9': 'Red Hat Enterprise Linux 5.9',
        'rhel6.0': 'Red Hat Enterprise Linux 6.0',
        'rhel6.1': 'Red Hat Enterprise Linux 6.1',
        'rhel6.2': 'Red Hat Enterprise Linux 6.2',
        'rhel6.3': 'Red Hat Enterprise Linux 6.3',
        'rhel6.4': 'Red Hat Enterprise Linux 6.4',
        'rhel6.5': 'Red Hat Enterprise Linux 6.5',
        'rhel6.6': 'Red Hat Enterprise Linux 6.6',
        'rhel6.7': 'Red Hat Enterprise Linux 6.7',
        'rhel6.8': 'Red Hat Enterprise Linux 6.8',
        'rhel6.9': 'Red Hat Enterprise Linux 6.9',
        'rhel7.0': 'Red Hat Enterprise Linux 7.0',
        'rhel7.1': 'Red Hat Enterprise Linux 7.1',
        'rhel7.2': 'Red Hat Enterprise Linux 7.2',
        'rhel7.3': 'Red Hat Enterprise Linux 7.3',
        'rhel7.4': 'Red Hat Enterprise Linux 7.4',
        'rhel7.5': 'Red Hat Enterprise Linux 7.5',
        'rhl1.0': 'Red Hat Linux 1.0',
        'rhl1.1': 'Red Hat Linux 1.1',
        'rhl2.0': 'Red Hat Linux 2.0',
        'rhl2.1': 'Red Hat Linux 2.1',
        'rhl3.0.3': 'Red Hat Linux 3.0.3',
        'rhl4.0': 'Red Hat Linux 4.0',
        'rhl4.1': 'Red Hat Linux 4.1',
        'rhl4.2': 'Red Hat Linux 4.2',
        'rhl5.0': 'Red Hat Linux 5.0',
        'rhl5.1': 'Red Hat Linux 5.1',
        'rhl5.2': 'Red Hat Linux 5.2',
        'rhl6.0': 'Red Hat Linux 6.0',
        'rhl6.1': 'Red Hat Linux 6.1',
        'rhl6.2': 'Red Hat Linux 6.2',
        rhl7: 'Red Hat Linux 7',
        'rhl7.1': 'Red Hat Linux 7.1',
        'rhl7.2': 'Red Hat Linux 7.2',
        'rhl7.3': 'Red Hat Linux 7.3',
        'rhl8.0': 'Red Hat Linux 8.0',
        rhl9: 'Red Hat Linux 9',
        sled10: 'SUSE Linux Enterprise Desktop 10',
        sled10sp1: 'SUSE Linux Enterprise Desktop 10 SP1',
        sled10sp2: 'SUSE Linux Enterprise Desktop 10 SP2',
        sled10sp3: 'SUSE Linux Enterprise Desktop 10 SP3',
        sled10sp4: 'SUSE Linux Enterprise Desktop 10 SP4',
        sled11: 'SUSE Linux Enterprise Desktop 11',
        sled11sp1: 'SUSE Linux Enterprise Desktop 11 SP1',
        sled11sp2: 'SUSE Linux Enterprise Desktop 11 SP2',
        sled11sp3: 'SUSE Linux Enterprise Desktop 11 SP3',
        sled11sp4: 'SUSE Linux Enterprise Desktop 11 SP4',
        sled12: 'SUSE Linux Enterprise Desktop 12',
        sled12sp1: 'SUSE Linux Enterprise Desktop 12 SP1',
        sled12sp2: 'SUSE Linux Enterprise Desktop 12 SP2',
        sled12sp3: 'SUSE Linux Enterprise Desktop 12 SP3',
        sled9: 'SUSE Linux Enterprise Desktop 9',
        sles10: 'SUSE Linux Enterprise Server 10',
        sles10sp1: 'SUSE Linux Enterprise Server 10 SP1',
        sles10sp2: 'SUSE Linux Enterprise Server 10 SP2',
        sles10sp3: 'SUSE Linux Enterprise Server 10 SP3',
        sles10sp4: 'SUSE Linux Enterprise Server 10 SP4',
        sles11: 'SUSE Linux Enterprise Server 11',
        sles11sp1: 'SUSE Linux Enterprise Server 11 SP1',
        sles11sp2: 'SUSE Linux Enterprise Server 11 SP2',
        sles11sp3: 'SUSE Linux Enterprise Server 11 SP3',
        sles11sp4: 'SUSE Linux Enterprise Server 11 SP4',
        sles12: 'SUSE Linux Enterprise Server 12',
        sles12sp1: 'SUSE Linux Enterprise Server 12 SP1',
        sles12sp2: 'SUSE Linux Enterprise Server 12 SP2',
        sles12sp3: 'SUSE Linux Enterprise Server 12 SP3',
        sles9: 'SUSE Linux Enterprise Server 9',
        solaris10: 'Solaris 10',
        solaris11: 'Oracle Solaris 11',
        solaris9: 'Solaris 9',
        'ubuntu10.04': 'Ubuntu 10.04 LTS',
        'ubuntu10.10': 'Ubuntu 10.10',
        'ubuntu11.04': 'Ubuntu 11.04',
        'ubuntu11.10': 'Ubuntu 11.10',
        'ubuntu12.04': 'Ubuntu 12.04 LTS',
        'ubuntu12.10': 'Ubuntu 12.10',
        'ubuntu13.04': 'Ubuntu 13.04',
        'ubuntu13.10': 'Ubuntu 13.10',
        'ubuntu14.04': 'Ubuntu 14.04 LTS',
        'ubuntu14.10': 'Ubuntu 14.10',
        'ubuntu15.04': 'Ubuntu 15.04',
        'ubuntu15.10': 'Ubuntu 15.10',
        'ubuntu16.04': 'Ubuntu 16.04',
        'ubuntu16.10': 'Ubuntu 16.10',
        'ubuntu17.04': 'Ubuntu 17.04',
        'ubuntu17.10': 'Ubuntu 17.10',
        'ubuntu4.10': 'Ubuntu 4.10',
        'ubuntu5.04': 'Ubuntu 5.04',
        'ubuntu5.10': 'Ubuntu 5.10',
        'ubuntu6.06': 'Ubuntu 6.06 LTS',
        'ubuntu6.10': 'Ubuntu 6.10',
        'ubuntu7.04': 'Ubuntu 7.04',
        'ubuntu7.10': 'Ubuntu 7.10',
        'ubuntu8.04': 'Ubuntu 8.04 LTS',
        'ubuntu8.10': 'Ubuntu 8.10',
        'ubuntu9.04': 'Ubuntu 9.04',
        'ubuntu9.10': 'Ubuntu 9.10',
        'win1.0': 'Microsoft Windows 1.0',
        win10: 'Microsoft Windows 10',
        'win2.0': 'Microsoft Windows 2.0',
        'win2.1': 'Microsoft Windows 2.1',
        win2k: 'Microsoft Windows 2000',
        win2k12: 'Microsoft Windows Server 2012',
        win2k12r2: 'Microsoft Windows Server 2012 R2',
        win2k16: 'Microsoft Windows Server 2016',
        win2k3: 'Microsoft Windows Server 2003',
        win2k3r2: 'Microsoft Windows Server 2003 R2',
        win2k8: 'Microsoft Windows Server 2008',
        win2k8r2: 'Microsoft Windows Server 2008 R2',
        'win3.1': 'Microsoft Windows 3.1',
        win7: 'Microsoft Windows 7',
        win8: 'Microsoft Windows 8',
        'win8.1': 'Microsoft Windows 8.1',
        win95: 'Microsoft Windows 95',
        win98: 'Microsoft Windows 98',
        winme: 'Microsoft Windows Millennium Edition',
        'winnt3.1': 'Microsoft Windows NT Server 3.1',
        'winnt3.5': 'Microsoft Windows NT Server 3.5',
        'winnt3.51': 'Microsoft Windows NT Server 3.51',
        'winnt4.0': 'Microsoft Windows NT Server 4.0',
        winvista: 'Microsoft Windows Vista',
        winxp: 'Microsoft Windows XP'
      };
      return osIdToName[osinfoId] || osinfoId;
    };
  });

