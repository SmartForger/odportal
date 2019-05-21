import { AuthDetailsRepresentaion } from './auth-details-representation';

export interface AdminEventRepresentation {
  authDetails?: AuthDetailsRepresentaion;
  error?: string;
  operationType?: string;
  realmId?: string;
  representation?: string;
  resourcePath?: string;
  resourceType?: string;
  time?: string;
}