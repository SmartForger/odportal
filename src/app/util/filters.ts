export class Filters {

    static removeArrayObjectKeys<T>(keys: Array<string>, objects: Array<T>): Array<T> {
        for (let i: number = 0; i < objects.length; ++i) {
            keys.forEach((k: string) => {
                delete objects[i][k];
            });
        }
        return objects;
    }

}