export class Util {

    static formatStringToId(val: string): string {
        if (val) {
            return val.trim().toLowerCase().replace(/\s+/g, '-');
        }
        return val;
    }

}