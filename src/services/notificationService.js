import { mockStorage, STORAGE_KEYS } from './api/mockStorage';

export const notificationService = {
  async getAll() {
    await mockStorage.delay(150);
    const list = mockStorage.get(STORAGE_KEYS.NOTIFICATIONS);
    return list;
  },

  async markAsRead(id) {
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
