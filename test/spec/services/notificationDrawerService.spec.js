'use strict';

describe('NotificationDrawerService', () => {
  var DrawerService;
  var EventsService;
  var BrowserStore;
  var project;

  beforeEach(() => {
    inject((_NotificationDrawerService_, _EventsService_, _BrowserStore_) => {
      DrawerService = _NotificationDrawerService_;
      EventsService = _EventsService_;
      BrowserStore = _BrowserStore_;

      // Wipe the store each test to ensure a clean slate.
      BrowserStore.clear('session','events');
    });
  });

  describe('#makeProjectGroup', () => {
    it('should create a group object', () => {
      project = {
        metadata: {
          name: 'myproject',
          annotations: {
            'openshift.io/display-name': 'My Project'
          }
        }
      };
      var notifications = [1,2,3,4,5];
      var group = DrawerService.makeProjectGroup(project, notifications);
      expect(group).toEqual({
        heading: 'My Project',
        project: project,
        notifications: [1,2,3,4,5]
      });
    });
  });

  describe('#clearAllNotificationsForGroup', () => {
    var notifications = [
      {message: 'first', unread: true, uid: 1},
      {message: 'second', unread: true, uid: 2},
      {message: 'third', unread: true, uid: 3},
    ];

    it('should set notification.unread property to false', () => {
      DrawerService.clearAllNotificationsForGroup(notifications);
      _.each(notifications, (notification) => {
        expect(notification.unread).toBe(false);
      });
    });
    it('should mark notifications read via persistent storage', () => {
      DrawerService.clearAllNotificationsForGroup(notifications);
      _.each(notifications, (notification) => {
        expect(EventsService.isRead(notification.uid)).toBe(true);
      });
    });
    it('should mark notifications cleared via persistent storage', () => {
      _.each(notifications, (notification) => {
        expect(EventsService.isCleared(notification.uid)).toBe(true);
      });
    });
  });

  describe('#countUnreadNotifications', () => {
    it('should count unread notifications for each notification group', () => {
      var groups = [{
          heading: 'Group 1',
          notifications: [{unread: true},{unread: true},{unread: true},{unread: true}]
        },{
          heading: 'Group 2',
          notifications: [{unread: false},{unread: true},{unread: false},{unread: true}]
        },{
          heading: 'Group 3',
          notifications: [{unread: false},{unread: false}]
        }];
      var counts = [{
        total: 4, hasUnread: true
      }, {
        total: 2, hasUnread: true
      }, {
        total: 0, hasUnread: false
      }];

      DrawerService.countUnreadNotifications(groups);
      _.each(groups, function(group, i) {
        expect(group.totalUnread).toEqual(counts[i].total);
        expect(group.hasUnread).toEqual(counts[i].hasUnread);
      });
    });
  });

  describe('#formatInternalNotification', () => {
    it('should take a notification and return an object formatted to display in the notification drawer', () => {
      var id = 12345;
      var type = 'Normal';
      var timestamp = Date.now();
      var message = 'Hello World';
      var details = 'Hello Again';
      var links = [{href: '#', label: 'Click me'}];
      var projectName = 'MyProject';
      var notification = {
        trackByID: id,
        id: id,
        message: message,
        type: type,
        timestamp: timestamp,
        details: details,
        links: links
      };
      var formatted = DrawerService.formatInternalNotification(notification, projectName);
      expect(formatted).toEqual({
        actions: null,
        unread: true,
        trackByID: id,
        uid: id,
        message: message,
        type: type,
        lastTimestamp: timestamp,
        details: details,
        namespace: projectName,
        links: links
      });
    });
  });

  describe('#formatAPIEvents', () => {
    it('should transform a set of API events into objects formatted to display in the notification drawer', () => {
      var firstEvent = {metadata: { uid: 123 }, type: 'Normal', lastTimestamp: 123, firstTimestamp: 123};
      var secondEvent = {metadata: { uid: 456 }, type: 'Normal', lastTimestamp: 456, firstTimestamp: 456};
      var apiEvents = [firstEvent, secondEvent];
      var formatted = DrawerService.formatAPIEvents(apiEvents);
      expect(formatted).toEqual([{
        actions: null,
        uid: 123,
        trackByID: 123,
        unread: true,
        type: 'Normal',
        lastTimestamp: 123,
        firstTimestamp: 123,
        event: firstEvent
      }, {
        actions: null,
        uid: 456,
        trackByID: 456,
        unread: true,
        type: 'Normal',
        lastTimestamp: 456,
        firstTimestamp: 456,
        event: secondEvent
      }]);
    });
  });

  describe('#filterAPIEvents', () => {
    it('should return only api events which have a type listed in the EVENTS_TO_SHOW constant', () => {
      var apiEvents = [{
        reason: 'FailedCreate', metadata: {uid: 21}
      },{
        reason: 'BuildCancelled', metadata: {uid: 22}
      },{
        reason: 'BuildStarted', metadata: {uid: 23}
      },{
        reason: 'DesiredReplicasComputedCustomMetric', metadata: {uid: 24}
      },{
        reason: 'InvalidDiskCapacity', metadata: {uid: 25}
      },{
        reason: 'FakeReason', metadata: {uid: 26}
      }];
      var filtered = DrawerService.filterAPIEvents(apiEvents);
      expect(_.keys(filtered)).toEqual(['21','22','23']);
      expect(filtered[21]).toEqual(apiEvents[0]);
      expect(filtered[22]).toEqual(apiEvents[1]);
      expect(filtered[23]).toEqual(apiEvents[2]);
    });
    xit('should return api events which have not yet been marked clear', () => {
      var apiEvents = [{
        reason: 'FailedCreate', metadata: {uid: 21}
      },{
        reason: 'BuildCancelled', metadata: {uid: 22}
      },{
        reason: 'BuildStarted', metadata: {uid: 23}
      },{
        reason: 'DesiredReplicasComputedCustomMetric', metadata: {uid: 24}
      },{
        reason: 'InvalidDiskCapacity', metadata: {uid: 25}
      },{
        reason: 'FakeReason', metadata: {uid: 26}
      }];

      EventsService.markCleared(21);
      EventsService.markCleared(23);
      var filtered = DrawerService.filterAPIEvents(apiEvents);
      expect(_.keys(filtered)).toEqual(['23']);
      expect(filtered[23]).toEqual(apiEvents[2]);
    });

  });

  describe('#mergeNotificationMaps', () => {
    it('combine notifications and events into one object', () => {
      var notifications = {
        foo: 'bar'
      };
      var events = {
        baz: 'shizzle'
      };
      expect(DrawerService.mergeNotificationMaps(notifications, events)).toEqual({
        foo: 'bar',
        baz: 'shizzle'
      });
    });
  });

  describe('#sortNotificationMap', () => {
    it('should sort notifications by lastTimestamp, then by firstTimestamp, both in descending order', () => {
      var notifications = [
        { firstTimestamp: 1, lastTimestamp: 50 },
        { firstTimestamp: 2, lastTimestamp: 30 },
        { firstTimestamp: 3, lastTimestamp: 30 },
        { firstTimestamp: 4, lastTimestamp: 30 },
        { firstTimestamp: 5, lastTimestamp: 10 }
      ];
      var sorted = DrawerService.sortNotificationMap(notifications);
      expect(sorted).toEqual([
        { firstTimestamp: 1, lastTimestamp: 50 },
        { firstTimestamp: 2, lastTimestamp: 30 },
        { firstTimestamp: 3, lastTimestamp: 30 },
        { firstTimestamp: 4, lastTimestamp: 30 },
        { firstTimestamp: 5, lastTimestamp: 10 },
      ]);
    });
  });

});
