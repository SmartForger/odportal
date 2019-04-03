import {} from 'jasmine';

import {Filters} from '../util/filters';

interface MockObject {

    id: string;
    firstName: string;
    lastName: string;
}

describe('filters', () => {

    it('should remove specified keys from the objects in the array', () => {
        let mockObj: MockObject = {
            id: "fake-user-id",
            firstName: "Steven",
            lastName: "Redman"
        };
        let arr: Array<MockObject> = new Array<MockObject>(mockObj);
        let updatedArr: Array<MockObject> = Filters.removeArrayObjectKeys<MockObject>(["id", "firstName"], arr);
        expect(updatedArr.length).toBe(1);
        expect(updatedArr[0].id).toBeUndefined();
        expect(updatedArr[0].firstName).toBeUndefined()
        expect(updatedArr[0].lastName).toBe("Redman");
    });

    it('should filter array objects containing a value defined in the values param that is tied to the specified key', () => {
        let mockObjOne: MockObject = {
            id: "fake-user-id",
            firstName: "Steven",
            lastName: "Redman"
        };
        let mockObjTwo: MockObject = {
            id: "fake-user-id2",
            firstName: "Michael",
            lastName: "Redmano"
        };
        let arr: Array<MockObject> = new Array<MockObject>(mockObjOne, mockObjTwo);
        let filtered: Array<MockObject> = Filters.removeByKeyValue<string, MockObject>("id", ["fake-user-id"], arr);
        expect(arr.length).toBe(2);
        expect(filtered.length).toBe(1);
        expect(filtered[0]).toEqual(mockObjTwo);
    }); 

});