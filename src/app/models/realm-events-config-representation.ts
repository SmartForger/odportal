export interface RealmEventsConfigRepresentation {
  adminEventsDetailsEnabled?: boolean;
  adminEventsEnabled?: boolean;
  enabledEventTypes?: string[];
  eventsEnabled?: boolean;
  eventsExpiration?: number;
  eventsListeners?: string[];
}