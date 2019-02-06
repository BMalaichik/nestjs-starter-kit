import { GeoDiToken } from "./geo.di";
import { GeoService } from "./geo.service";


export const geoProviders = [
    {
        provide: GeoDiToken.GEO_SERVICE,
        useClass: GeoService,
    },
];
