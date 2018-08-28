import { TypeMapper } from "./type-mapper";
import { TypeMapperDiToken } from "./type-mapper.di";


export const typeMapperProviders = [
    {
        provide: TypeMapperDiToken.MAPPER,
        useValue: new TypeMapper(),
    },
];
