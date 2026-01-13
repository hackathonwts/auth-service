"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aggregatePaginate = aggregatePaginate;
async function aggregatePaginate(model, pipeline, options = {}) {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, options.limit || 10);
    const skip = (page - 1) * limit;
    const sortStage = { $sort: options.sort || { _id: -1 } };
    const aggregationPipeline = [...pipeline, sortStage, { $skip: skip }, { $limit: limit }];
    const countPipeline = [...pipeline, { $count: 'totalDocs' }];
    const [docs, countResult] = await Promise.all([model.aggregate(aggregationPipeline).allowDiskUse(options.allowDiskUse ?? true), model.aggregate(countPipeline).allowDiskUse(options.allowDiskUse ?? true)]);
    const totalDocs = countResult.length ? countResult[0].totalDocs : 0;
    const totalPages = Math.ceil(totalDocs / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;
    return {
        docs,
        meta: {
            totalDocs,
            totalPages,
            page,
            limit,
            hasPrevPage,
            hasNextPage,
            prevPage: hasPrevPage ? page - 1 : null,
            nextPage: hasNextPage ? page + 1 : null,
        },
    };
}
