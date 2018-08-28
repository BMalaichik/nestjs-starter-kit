import { TypeMapperException } from "./exceptions/type-mapper.exception";


type Constructor<T> = new (...args: any[]) => T;

export type Mapper<T1, T2> = (value: T1, opts: any) => T2;


export class TypeMapper {

    private mappersRegistry: Map<string, (value: any, opts?: {}) => any>;

    public constructor() {
        this.mappersRegistry = new Map();
    }

    public register<T1, T2>(t1: Constructor<T1>, t2: Constructor<T2>, mapper: Mapper<T1, T2>, opts: { override?: boolean } = {}) {
        TypeMapper.validateType(t1);
        TypeMapper.validateType(t2);

        const registryKey: string = TypeMapper.getRegistryKey<T1, T2>(t1, t2);
        const existingMapper = this.mappersRegistry.get(registryKey);

        if (existingMapper && !opts.override) {
            throw new TypeMapperException(`Types mapping for ${registryKey} already exists, use override option`);
        }

        this.mappersRegistry.set(registryKey, mapper);
    }

    public map<T1, T2>(t1: Constructor<T1>, t2: Constructor<T2>, value: T1, opts = {}): T2 {
        TypeMapper.validateType(t1);
        TypeMapper.validateType(t2);

        const registryKey: string = TypeMapper.getRegistryKey(t1, t2);
        const mapper = this.mappersRegistry.get(registryKey);

        if (!mapper) {
            throw new TypeMapperException(`Types mapping for ${registryKey} doesnt exist`);
        }

        if (!value) {
            console.warn(`TypeMapperWarning: no value provided, key: ${registryKey}`);

            return;
        }

        return mapper(value, opts);
    }

    private static validateType<T>(t: Constructor<T>): void {
        if (!(t instanceof Function)) {
            throw new TypeMapperException(`Validation fails: provided non-class value: ${t}`);
        }
    }

    private static getRegistryKey<T1, T2>(t1: Constructor<T1>, t2: Constructor<T2>): string {
        return `${TypeMapper.getTypeId(t1)}:${TypeMapper.getTypeId(t2)}`;
    }

    private static getTypeId<T>(t: Constructor<T>): string {
        return `${t.name.toLowerCase()}`;
    }
}

