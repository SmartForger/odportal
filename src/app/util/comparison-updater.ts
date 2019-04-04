/**
 * @description Utility class containing methods for making unequal objects equal
 * @author Steven M. Redman
 */

export class ComparisonUpdater {

    static updateObject<T>(updatedObj: T, originalObj: T): T {
        for (let key in updatedObj) {
            originalObj[key] = updatedObj[key];
        }
        return originalObj;
    }

}