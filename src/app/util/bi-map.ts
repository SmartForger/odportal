export class BiMap<KeyType, ValueType> {

    private normalLookup: Map<KeyType, ValueType>;
    private reverseLookup: Map<ValueType, KeyType>;

    constructor() {
        this.normalLookup = new Map<KeyType, ValueType>();
        this.reverseLookup = new Map<ValueType, KeyType>();
    }

    add(key: KeyType, value: ValueType): void {
        this.normalLookup.set(key, value);
        this.reverseLookup.set(value, key);
    }

    findByKey(key: KeyType): ValueType {
        return this.normalLookup.get(key);
    }

    findByValue(value: ValueType): KeyType {
        return this.reverseLookup.get(value);
    }

    deleteByKey(key: KeyType): void {
        const value: ValueType = this.normalLookup.get(key);
        this.normalLookup.delete(key);
        this.reverseLookup.delete(value);
    }

    deleteByValue(value: ValueType): void {
        const key: KeyType = this.reverseLookup.get(value);
        this.reverseLookup.delete(value);
        this.normalLookup.delete(key);
    }

}