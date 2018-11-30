import {Observable} from 'rxjs';
import {ApiResponse} from '../models/api-response.model';

export interface TestableService {

    test(route: string): Observable<ApiResponse>;

}