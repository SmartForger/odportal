import {} from 'jasmine';

import {Cloner} from '../util/cloner';

interface MockObject {
    firstName: string,
    lastName: string,
    attrs: {hairColor: string, eyeColor: string}
}

describe('cloner', () => {

    const mockObject: MockObject = {
        firstName: "Steven",
        lastName: "Redman",
        attrs: {
            hairColor: "black",
            eyeColor: "hazel"
        }
    };

    it('should clone an array of objects', () => {
        const objArray: Array<MockObject> = new Array<MockObject>(mockObject);
        const clonedObj: Array<MockObject> = Cloner.cloneObjectArray<MockObject>(objArray);
        expect(objArray).toEqual(clonedObj);
        expect(objArray[0]).toEqual(clonedObj[0]);
        expect(objArray === clonedObj).toBe(false);
        expect(objArray[0] === clonedObj[0]).toBe(false);
    });

    it('should clone an object', () => {
        const clonedObj: MockObject = Cloner.cloneObject<MockObject>(mockObject);
        expect(clonedObj).toEqual(mockObject);
        expect(clonedObj === mockObject).toBe(false);
    });

});