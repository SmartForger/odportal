import {CredentialsRepresentation} from './credentials-representation.model';
import {UserRepresentation} from './user-representation.model';

export interface UserCreation {

    user: UserRepresentation;
    creds: CredentialsRepresentation

}