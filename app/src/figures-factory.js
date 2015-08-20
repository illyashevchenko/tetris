/**
 * Created by Illia_Shevchenko on 14.08.2015.
 */
'use strict';


/**
 * A module for generating figures randomly
 * @module figures-factory
 * @todo configurations load from json and can be mocked
 */
define(['figure'], function (Figure) {
    var configurations = [
            //LINE
            [{
                points: [
                    0, 1,
                    0, 1,
                    0, 1,
                    0, 1],
                width: 2
            }, {
                points: [
                    0, 0, 0, 0,
                    1, 1, 1, 1],
                width : 4
            }],

            //square
            [{
                points: [
                    1, 1,
                    1, 1],
                width: 2
            }],

            //L
            [{
                points: [
                    1, 0,
                    1, 0,
                    1, 1],
                width : 2
            }, {
                points: [
                    0, 0, 0,
                    1, 1, 1,
                    1, 0, 0],
                width : 3
            }, {
                points: [
                    0, 1, 1,
                    0, 0, 1,
                    0, 0, 1],
                width : 3
            }, {
                points: [
                    0, 0, 0,
                    0, 0, 1,
                    1, 1, 1],
                width : 3
            }],

            //L reflected
            [{
                points: [
                    0, 0, 1,
                    0, 0, 1,
                    0, 1, 1],
                width : 3
            }, {
                points: [
                    0, 0, 0,
                    1, 0, 0,
                    1, 1, 1],
                width : 3
            }, {
                points: [
                    1, 1,
                    1, 0,
                    1, 0],
                width : 2
            }, {
                points: [
                    1, 1, 1,
                    0, 0, 1],
                width : 3
            }],

            //T
            [{
                points: [
                    0, 0, 0,
                    0, 1, 0,
                    1, 1, 1],
                width : 3
            }, {
                points: [
                    1, 0,
                    1, 1,
                    1, 0],
                width : 2
            }, {
                points: [
                    1, 1, 1,
                    0, 1, 0],
                width : 3
            }, {
                points: [
                    0, 0, 1,
                    0, 1, 1,
                    0, 0, 1],
                width : 3
            }],

            //Z
            [{
                points: [
                    0, 0, 0,
                    1, 1, 0,
                    0, 1, 1],
                width : 3
            }, {
                points: [
                    0, 0, 1,
                    0, 1, 1,
                    0, 1, 0],
                width : 3
            }],

            //Z reflected
            [{
                points: [
                    0, 0, 0,
                    0, 1, 1,
                    1, 1, 0],
                width : 3
            }, {
                points: [
                    1, 0,
                    1, 1,
                    0, 1],
                width : 2
            }]
        ],
        getRandom = function (max) {
            return Math.floor(Math.random() * max);
        };

    return {
        /**
         * Returns Figure class instance with given position
         * @param {number} [middleOffset = 0] Offset  of the horizontal center of the created figure
         * @param {number} [topOffset = 0] Top offset for a figure
         * @returns {Figure}
         */
        getFigure: function (middleOffset, topOffset) {
            var configNumber = getRandom(configurations.length),
                allowedConfiguration = configurations[configNumber],
                startIndex = getRandom(allowedConfiguration.length),

                width  = allowedConfiguration[startIndex].width,
                height = Math.floor(allowedConfiguration[startIndex].points.length / width);

            return new Figure({
                left: (middleOffset || 0) - Math.floor(width / 2),
                top : -height + (topOffset || 0),
                allowedConfigurations: allowedConfiguration,
                startIndex : startIndex,
                pointsValue: configNumber + 1
            });
        }
    };
});