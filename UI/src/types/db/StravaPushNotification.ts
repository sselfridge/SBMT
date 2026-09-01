// StravaPushNotificationDTO — shape received from the Strava webhook
export interface StravaPushNotificationDTO {
  aspect_type: string | null;
  event_time: number;
  object_id: number;
  object_type: string | null;
  owner_id: number;
  subscription_id: number;
  updates: Record<string, unknown> | null;
}

// StravaPushNotification — the persisted db entity
export interface StravaPushNotification {
  id: string; // GUID
  aspectType: string | null;
  eventTime: number;
  objectId: number;
  objectType: string | null;
  ownerId: number;
  subscriptionId: number;
  updates: string | null; // serialized JSON string
}
