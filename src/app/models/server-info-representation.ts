export interface ServerInfoRepresentation {
  enums?: {
    eventType?: string[];
  };
  providers?: {
    eventsListener?: {
      providers?: Object;
    };
  };
}