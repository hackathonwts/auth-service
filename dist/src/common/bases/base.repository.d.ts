import { FilterQuery, HydratedDocument, Model, ProjectionFields, Types, UpdateQuery } from 'mongoose';
import mongodb from 'mongodb';
export declare class BaseRepository<T> {
    private readonly model;
    constructor(model: Model<T>);
    getAll(params: FilterQuery<T>): Promise<T[]>;
    getAllByField(params: FilterQuery<T>): Promise<T[]>;
    getByField(params: FilterQuery<T>): Promise<T>;
    getById(id: Types.ObjectId | string): Promise<T>;
    getCountByParam(params: FilterQuery<T>): Promise<number>;
    save(body: Partial<T>): Promise<T>;
    saveMany(body: Partial<T>[]): Promise<HydratedDocument<T>[]>;
    updateById(data: UpdateQuery<T>, id: string | Types.ObjectId): Promise<T>;
    getDistinctDocument(field: string, params: FilterQuery<T>): Promise<unknown[]>;
    getAllByFieldWithProjection(params: FilterQuery<T>, projection: ProjectionFields<T>): Promise<T[]>;
    getByFieldWithProjection(params: FilterQuery<T>, projection: ProjectionFields<T>): Promise<T>;
    delete(id: string | Types.ObjectId): Promise<T>;
    bulkDelete(params: FilterQuery<T>): Promise<mongodb.DeleteResult>;
    updateByField(data: UpdateQuery<T>, param: FilterQuery<T>): Promise<mongodb.UpdateResult>;
    updateAllByParams(data: UpdateQuery<T>, params: FilterQuery<mongodb.UpdateResult>): Promise<import("mongoose").UpdateWriteOpResult>;
    bulkDeleteSoft(ids: Types.ObjectId[] | string[]): Promise<mongodb.UpdateResult>;
    saveOrUpdate(data: UpdateQuery<T>, id?: string | Types.ObjectId): Promise<T>;
    findOneAndUpdate(filter: FilterQuery<T>, data: UpdateQuery<T>): Promise<T>;
}
