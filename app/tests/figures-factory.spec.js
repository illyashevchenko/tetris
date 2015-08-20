/**
 * Created by Illia_Shevchenko on 14.08.2015.
 */
'use strict';


define(['Squire'], function (Squire) {
    var FigureMock = function () {
        //this.allowedConfigurations = settings.allowedConfigurations;
    };

    FigureMock.prototype = {
        constructor: FigureMock
    };

    //TODO: Add testing settings position
    describe('Figures Factory', function () {
        var injector,
            figuresFactory;

        beforeEach(function (done) {
            injector = new Squire();
            injector.mock('figure', FigureMock)
                .require(['figures-factory'], function (figuresFactoryLoaded) {
                    figuresFactory = figuresFactoryLoaded;
                    done();
                });
        });

        afterEach(function () {
            injector.remove();
            figuresFactory = null;
        });

        it('should create instances of Figure class', function () {
            expect(figuresFactory.getFigure(0, 0)).toEqual(jasmine.any(FigureMock));
        });
    });
});