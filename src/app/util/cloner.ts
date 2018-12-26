export class Cloner {

    static cloneObjectArray<T>(items: Array<T>): Array<T> {
        let clones: Array<T> = new Array<T>();
        items.forEach((item: T) => {
            clones.push(Object.assign({}, item));
        });
        return clones;
    }

}