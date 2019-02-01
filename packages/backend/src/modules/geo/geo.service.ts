import "bluebird-global";
import * as Bluebird from "bluebird";
import * as _ from "lodash";
import { createClient } from "@google/maps";
import { Injectable, Inject } from "@nestjs/common";

import { ContactDto } from "../contact";
import { GeoCoordinates } from "./geo.interfaces";
import { GeoRequestException } from "./exceptions";
import { ConfigDiToken, Config } from "../config";
import { LoggerDiToken, LoggerService } from "../logger";


@Injectable()
export class GeoService {
    private client: any;

    public constructor(
        @Inject(ConfigDiToken.CONFIG) private readonly config: Config,
        @Inject(LoggerDiToken.LOGGER) private readonly logger: LoggerService,
    ) {
        const key = _.get(this.config, "geo.apiKey", null);
        this.client = key && createClient({
            key,
            Promise: Bluebird,
        });
    }

    public async getLocation(contact: ContactDto): Promise<GeoCoordinates> {
        if (!this.client) {
            throw new Error(`Maps API Client is not resolved`);
        }

        try {
            const fullAddress = this.getFullAddress(contact);
            const response = await this.client.geocode({ address: fullAddress }).asPromise();
            const result: any = _.head(response.json.results);

            if (!_.get(result, "geometry.location")) {
                throw new GeoRequestException(`Address ${ fullAddress} not resolved`);
            }

            return {
                lng: result.geometry.location.lng,
                lat: result.geometry.location.lat,
                fullAddress: result.formatted_address,
            };
        } catch (err) {
            this.logger.error(`Error occurred resolving geo code`);
            this.logger.error(err);
        }
    }

    private getFullAddress(contact: ContactDto): string {
        // TODO: refactor, make more elegant
        if (contact.address || contact.city || contact.state) {
            return contact.address + contact.city + contact.state;
        }
    }
}
