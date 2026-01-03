// Request notification permission
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
};

// Show notification
export const showNotification = (title: string, options?: NotificationOptions) => {
  if (Notification.permission === 'granted') {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      // Use service worker for better notification management
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, {
          icon: '/icon.svg',
          badge: '/icon.svg',
          ...options,
        });
      });
    } else {
      // Fallback to regular notification
      new Notification(title, {
        icon: '/icon.svg',
        badge: '/icon.svg',
        ...options,
      });
    }
  }
};

// Notification for expense added
export const notifyExpenseAdded = (amount: number, category: string) => {
  showNotification('Expense Added', {
    body: `₹${amount.toLocaleString('en-IN')} added to ${category}`,
    tag: 'expense-added',
  });
};

// Notification for expense updated
export const notifyExpenseUpdated = (amount: number, category: string) => {
  showNotification('Expense Updated', {
    body: `Updated: ₹${amount.toLocaleString('en-IN')} in ${category}`,
    tag: 'expense-updated',
  });
};

// Notification for expense deleted
export const notifyExpenseDeleted = (category: string) => {
  showNotification('Expense Deleted', {
    body: `Expense from ${category} has been deleted`,
    tag: 'expense-deleted',
  });
};

// Check if notifications are supported
export const isNotificationSupported = (): boolean => {
  return 'Notification' in window;
};

// Get notification permission status
export const getNotificationPermission = (): NotificationPermission => {
  if (!isNotificationSupported()) {
    return 'denied';
  }
  return Notification.permission;
};
