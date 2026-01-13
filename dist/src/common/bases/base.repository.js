"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    async getAll(params) {
        return await this.model.find(params);
    }
    async getAllByField(params) {
        return await this.model.find(params);
    }
    async getByField(params) {
        return await this.model.findOne(params);
    }
    async getById(id) {
        return await this.model.findById(id);
    }
    async getCountByParam(params) {
        return await this.model.countDocuments(params);
    }
    async save(body) {
        return await this.model.create(body);
    }
    async saveMany(body) {
        const docs = await this.model.insertMany(body);
        return docs;
    }
    async updateById(data, id) {
        return await this.model.findByIdAndUpdate(id, data, {
            new: true,
        });
    }
    async getDistinctDocument(field, params) {
        return await this.model.distinct(field, params);
    }
    async getAllByFieldWithProjection(params, projection) {
        return await this.model.find(params, projection);
    }
    async getByFieldWithProjection(params, projection) {
        return await this.model.findOne(params, projection);
    }
    async delete(id) {
        return await this.model.findByIdAndDelete(id);
    }
    async bulkDelete(params) {
        return await this.model.deleteMany(params);
    }
    async updateByField(data, param) {
        return await this.model.updateOne(param, data);
    }
    async updateAllByParams(data, params) {
        return await this.model.updateMany(params, { $set: data });
    }
    async bulkDeleteSoft(ids) {
        return await this.model.updateMany({ _id: { $in: ids } }, { $set: { isDeleted: true } });
    }
    async saveOrUpdate(data, id = undefined) {
        const isExists = await this.model.findById(id);
        if (isExists)
            return await this.model.findByIdAndUpdate(id, data, { new: true });
        return await this.model.create(data);
    }
    async findOneAndUpdate(filter, data) {
        return await this.model.findOneAndUpdate(filter, data, { upsert: true, new: true });
    }
}
exports.BaseRepository = BaseRepository;
