/**
 * Created by Illia_Shevchenko on 31.08.2015.
 */
'use strict';


const HttpError = require('../models/errors/http');

module.exports = function (req, res, next) {
    let err = new HttpError('Not Found', 404);
    next(err);
};