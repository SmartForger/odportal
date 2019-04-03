import {} from 'jasmine';

import {BiMap} from '../util/bi-map';

describe('bi-map', () => {

    let biMap: BiMap<string, string> = new BiMap<string, string>();
    const key: string = "key";
    const value: string = "value";
    const key2: string = "key2";
    const value2: string = "value2";

    it('should add a record and find by key', () => {
        biMap.add(key, value);
        expect(biMap.findByKey(key)).toBe(value);
    });

    it('should add a record and find by value', () => {
        biMap.add(key2, value2);
        expect(biMap.findByValue(value2)).toBe(key2);
    });

    it('should delete a record by key and return undefined on findByKey', () => {
        biMap.deleteByKey(key);
        expect(biMap.findByKey(key)).toBeUndefined();
    });

    it('should delete a record by value and return undefined on findByValue', () => {
        biMap.deleteByValue(value2);
        expect(biMap.findByValue(value2)).toBeUndefined();
    });

});