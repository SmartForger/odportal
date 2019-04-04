import {} from 'jasmine';

import {ComparisonUpdater} from '../util/comparison-updater';

interface MockObject {

    firstName: string;
    lastName: string;
    attrs?: {eyeColor: string; hairColor: string};

}

describe('comparison-updater', () => {

    it('should make two objects with unmatched fields equal', () => {
        let originalObj: MockObject = {
            firstName: "Steven",
            lastName: "Redman"
        };
        let updatedObj: MockObject = {
            firstName: "Michael",
            lastName: "Redmano",
            attrs: {
                eyeColor: "hazel",
                hairColor: "black"
            }
        };
        let result: MockObject = ComparisonUpdater.updateObject<MockObject>(updatedObj, originalObj);
        expect(result).toEqual(updatedObj);
        expect(originalObj).toEqual(updatedObj);
    });

});