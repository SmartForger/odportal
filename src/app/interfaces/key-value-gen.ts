import {KeyValue} from '../models/key-value.model';
import {Observable} from 'rxjs';

export interface KeyValueGen {

    generateKeyValues(): Observable<Array<KeyValue>>;

}