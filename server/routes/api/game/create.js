/**
 * Created by Illia_Shevchenko on 31.08.2015.
 */
'use strict';


module.exports = function (req, res, next) {
    try {
        res.send('Created new item with name:' + req.body.name);
    } catch (error) {
        next(error);
    }
};