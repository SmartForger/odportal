/**
 * @description Utility class containing methods for filtering arrays of objects
 * @author Steven M. Redman
 */

export class Filters {

    static removeArrayObjectKeys<T>(keys: Array<string>, objects: Array<T>): Array<T> {
        for (let i: number = 0; i < objects.length; ++i) {
            if (objects[i]) {
                keys.forEach((k: string) => {
                    delete objects[i][k];
                });
            }
        }
        return objects;
    }

    static removeByKeyValue<T, V>(key: string, values: Array<T>, arr: Array<V>): Array<V> {
        return arr.filter((item: V) => {
            let match: boolean = true;
            if (item) {
                for (let i: number = 0; i < values.length; ++i) {
                    if (item[key] == values[i]) {
                        match = false;
                        break;
                    }
                }
            }
            else {
                match = false;
            }
            return match;
        });
    }

    static filterByKeyword<T>(keys: Array<string>, keyword: string, objects: Array<T>): Array<T> {
        return objects.filter((item: T) => {
            if (item) {
                for (let i = 0; i < keys.length; i ++) {
                    if (item[keys[i]] && item[keys[i]].toLowerCase().indexOf(keyword.toLowerCase()) >= 0) {
                        return true;
                    }
                }
            }
            return false;
        });
    }
}