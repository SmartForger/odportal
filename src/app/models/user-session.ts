export interface UserSession {
  id: string;
  username: string;
  userId: string;
  clientId: string;
  ipAddress: string;
  start: number;
  lastAccess: number;
}