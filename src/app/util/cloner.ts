/**
 * @description Utility class containing methods for cloning arrays and objects
 * @author Steven M. Redman
 */

export class Cloner {

    static cloneObjectArray<T>(items: Array<T>): Array<T> {
        let clones: Array<T> = new Array<T>();
        items.forEach((item: T) => {
            clones.push(Cloner.cloneObject<T>(item));
        });
        return clones;
    }

    static cloneArrayShallow<T>(items: Array<T>): Array<T> {
        let copy: Array<T> = new Array<T>();
        items.forEach((item: T) => {
            copy.push(item);
        });
        return copy;
    }

    static cloneObject<T>(item: T): T {
        return JSON.parse(JSON.stringify(item));
    }

}