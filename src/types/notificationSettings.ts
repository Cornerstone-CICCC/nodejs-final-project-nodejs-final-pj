export interface NotificationSettings {
  id: string;
  userId: string;
  notificationsEnabled: boolean;
  notificationTypes: {
    messages: boolean;
  };
}

export interface NotificationPayload {
  type: string;
  recipientId: string;
  title: string;
  body: string;
  notificationType: string;
}

export interface NotificationSettingsResponse {
  success: boolean;
  settings: {
    notificationTypes: { [key: string]: boolean };
    userId: string;
    notificationsEnabled: boolean;
    id: string;
  };
}
