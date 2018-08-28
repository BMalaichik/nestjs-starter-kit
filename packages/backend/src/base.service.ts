import * as _ from "lodash";
import { Model } from "sequelize-typescript";

import { BaseDto } from "./base.dto";
import { EntityNotFoundException } from "./http/exceptions";
import { InstanceUpdateOptions, UpdateOptions, WhereOptions } from "sequelize";


export abstract class BaseService {
    /**
     *  Methods analyzes existing records & records to update by primaryField.
     *  Returns [ [models_to_create], [models_to_update], [models_to_delete] ]
     */
    public getCUDModels<T>(existingRecords: T[], recordsToUpdate: T[], primaryField = "id"): [T[], T[], T[]] {
        const toCreate: T[] = _.differenceBy(recordsToUpdate, existingRecords, primaryField);
        const toUpdate: T[] = _.intersectionBy(recordsToUpdate, existingRecords, primaryField);
        const toDelete: T[] = _.differenceBy(existingRecords, recordsToUpdate, primaryField);

        return [toCreate, toUpdate, toDelete];
    }

    public async updateBy<T extends BaseDto>(
        repository,
        model: typeof Model,
        entity: BaseDto,
        matchField = "id",
        returning = false,
        fields?: (keyof T)[],
    ): Promise<void | T> {
        const fieldsToUpdate = fields || (model as any).PUBLIC_ATTRIBUTES;

        if (!fieldsToUpdate) {
            // TODO: replace with InvalidEntityConfigurationException
            throw new Error(
                `No fields to update specified`,
            );
        }

        const lookupOptions = { [matchField]: entity[matchField] };
        const options: UpdateOptions = {
            limit: 1,
            fields: fieldsToUpdate,
            where: lookupOptions,
        };

        await repository.update(entity, options);

        if (returning) {
            return repository.findOne({ where: lookupOptions });
        }
    }

    public async destroyBy<T extends BaseDto>(repository, attributeValue: string | number, matchField = "id"): Promise<void> {
        const deletedAmount: number = await repository.destroy({ where: { [matchField]: attributeValue }, limit: 1 });

        if (deletedAmount !== 1) {
            throw new EntityNotFoundException(`${repository.name}`);
        }
    }

    public async multipleDestroyBy<T extends BaseDto>(repository, attributeValues: (string | number)[], matchField = "id"): Promise<number> {
        if (_.isEmpty(attributeValues)) {
            // console.warn(`Empty attribute values provided for multiple destroy over ${repository.name}, skipping ...`);
            return;
        }

        const deletedAmount: number = await repository.destroy({ where: { [matchField]: { $in: attributeValues } } });

        if (deletedAmount !== attributeValues.length) {
            // console.warn(``);
        }

        return deletedAmount;
    }
}
