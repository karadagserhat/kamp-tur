const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('Böyle bir ID ye ait döküman yok!', 404));
    }

    const modelName = Model.modelName.toLowerCase();

    res.status(204).json({
      status: 'success',
      [modelName]: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!doc) {
      return next(new AppError('Böyle bir ID ye ait döküman yok!', 404));
    }

    const modelName = Model.modelName.toLowerCase();

    res.status(200).json({
      status: 'success',
      data: {
        [modelName]: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    const modelName = Model.modelName.toLowerCase();

    res.status(201).json({
      status: 'success',
      data: {
        [modelName]: doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;
    // const doc = await Model.findById(req.params.id).populate('reviews');

    if (!doc) {
      return next(new AppError('Böyle bir ID ye ait döküman yok!', 404));
    }

    const modelName = Model.modelName.toLowerCase();

    res.status(200).json({
      status: 'success',
      data: {
        [modelName]: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query).filter().sort().limitFields().paginate();
    const doc = await features.query;
    // const doc = await features.query.explain();

    const modelName = Model.modelName.toLowerCase();

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        [modelName]: doc,
      },
    });
  });
