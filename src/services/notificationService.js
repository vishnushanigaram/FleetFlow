import { apiClient } from './api/apiClient';
import { mockStorage, STORAGE_KEYS } from './api/mockStorage';

export const notificationService = {
  async getAll() {
    if (apiClient.isBackendActive()) {
      try {
        const list = await apiClient.get('/notifications');
        return list.map(n => ({
          ...n,
          read: n.isRead !== undefined ? n.isRead : n.read
        }));
      } catch (err) {
        console.warn('[notificationService] Spring Boot API failed, falling back to mock:', err.message);
      }
    }

    await mockStorage.delay(150);
    const list = mockStorage.get(STORAGE_KEYS.NOTIFICATIONS);
    return list;
  },

  async markAsRead(id) {
    if (apiClient.isBackendActive()) {
      try {
        const res = await apiClient.patch(`/notifications/${id}/read`);
        return {
          ...res,
          read: res.isRead !== undefined ? res.isRead : res.read
        };
      } catch (err) {
        console.warn('[notificationService] Spring Boot API failed, falling back to mock:', err.message);
      }
    }

    await mockStorage.delay(100);
    const list = mockStorage.get(STORAGE_KEYS.NOTIFICATIONS);
    const item = list.find(n => n.id === id);
    if (item) {
      item.read = true;
      mockStorage.set(STORAGE_KEYS.NOTIFICATIONS, list);
    }
    return item;
  },

  async markAllAsRead() {
    if (apiClient.isBackendActive()) {
      try {
        await apiClient.post('/notifications/read-all');
        return await this.getAll();
      } catch (err) {
        console.warn('[notificationService] Spring Boot API failed, falling back to mock:', err.message);
      }
    }

    await mockStorage.delay(150);
    const list = mockStorage.get(STORAGE_KEYS.NOTIFICATIONS);
    list.forEach(n => { n.read = true; });
    mockStorage.set(STORAGE_KEYS.NOTIFICATIONS, list);
    return list;
  },

  async addNotification(notif) {
    const list = mockStorage.get(STORAGE_KEYS.NOTIFICATIONS);
    const newNotif = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      type: notif.type || 'SYSTEM',
      title: notif.title,
      message: notif.message,
      severity: notif.severity || 'info',
      read: false,
      createdAt: new Date().toISOString(),
      link: notif.link || null
    };
    list.unshift(newNotif);
    mockStorage.set(STORAGE_KEYS.NOTIFICATIONS, list);
    return newNotif;
  }
};
