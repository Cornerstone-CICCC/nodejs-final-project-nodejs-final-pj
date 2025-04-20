export interface NotificationSettings {
  id: string;
  userId: string;
  notificationsEnabled: boolean;
  notificationTypes: {
    messages: boolean;
  };
}

export interface NotificationRequest {
  recipientId: string;
  title: string;
  body: string;
}

export interface NotificationResponse {
  success: boolean;
  message: string;
}