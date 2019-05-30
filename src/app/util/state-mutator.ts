export class StateMutator {

    static parseState(state: any): any {
        let result: any;
        try {
            result = JSON.parse(state);
        }
        catch (err) {
            result = state;
        }
        return result;
    }

    static stringifyState(state: any): any {
        let result: any;
        if (typeof state === "string") {
            result = state;
        }
        else {
            result = JSON.stringify(state);
        }
        return result;
    }

}