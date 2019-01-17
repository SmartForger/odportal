export class Cloner {

    static cloneObjectArray<T>(items: Array<T>): Array<T> {
        let clones: Array<T> = new Array<T>();
        items.forEach((item: T) => {
            clones.push(Cloner.cloneObject<T>(item));
        });
        return clones;
    }

    static cloneObject<T>(item: T): T {
        return JSON.parse(JSON.stringify(item));
    }

}