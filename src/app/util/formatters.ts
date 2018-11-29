export class Formatters {

    static formatStringToId(val: string): string {
        if (val) {
            return val.trim().toLowerCase().replace(/\s+/g, '-');
        }
        return val;
    }

    static createHiddenPassword(password: string): string {
        let hidden = "";
        for (let i: number = 0; i < password.length; ++i) {
            hidden += "*";
        }
        return hidden;
    }

}