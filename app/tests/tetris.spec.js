/**
 * Created by Illia_Shevchenko on 14.08.2015.
 */
'use strict';

define(['tetris'], function (Tetris) {
    describe('Tetris', function () {
        var tetris,
            settings,
            figure,
            fieldMap = {},
            figureMap = {};

        beforeEach(function () {
            figure = {
                moveLeft : function () { return figureMap; },
                moveRight: function () { return figureMap; },
                moveDown : function () { return figureMap; },
                rotate   : function () { return figureMap; },
                getMap   : function () { return figureMap; },
                setMap   : function () {}
            };

            settings = {
                canvas : {
                    addElement   : function () {},
                    removeElement: function () {},
                    updateElement: function () {}
                },
                preview: {
                    addElement   : function () {},
                    removeElement: function () {}
                },
                field: {
                    checkMap: function () {},
                    layMap  : function () {},
                    getMap  : function () { return fieldMap; }
                },
                onNewFigure : function () { return figure; },
                onLineStrike: function () {},
                onFinish    : function () {}
            };

            tetris = new Tetris(settings);
        });

        describe('Creating', function () {
            beforeEach(function () {
                spyOn(settings.canvas, 'addElement');
                spyOn(settings.preview, 'addElement');
                spyOn(settings.preview, 'removeElement');
                spyOn(tetris, 'onNewFigure').and.callThrough();
                tetris.start();
            });

            it('should call to add field map to the canvas on start', function () {
                expect(settings.canvas.addElement).toHaveBeenCalledWith(fieldMap);
            });

            it('should call to new figure and add figure map to he canvas on start', function () {
                expect(tetris.onNewFigure).toHaveBeenCalled();

                //expect(settings.preview.removeElement).toHaveBeenCalled();
                expect(settings.canvas.addElement).toHaveBeenCalledWith(figureMap);
                //expect(tetris.onNewFigure).toHaveBeenCalled();
                //expect(settings.preview.addElement).toHaveBeenCalled();
            });
        });

        describe('Moving figures', function () {
            beforeEach(function () {
                tetris.start();

                spyOn(figure, 'moveLeft').and.callThrough();
                spyOn(figure, 'moveRight').and.callThrough();
                spyOn(figure, 'moveDown').and.callThrough();
                spyOn(figure, 'rotate').and.callThrough();
                spyOn(figure, 'setMap');
                spyOn(settings.canvas, 'updateElement');
            });

            describe('Methods on success map checks', function () {
                beforeEach(function () {
                    spyOn(settings.field, 'checkMap').and.callFake(function () {
                        return 1;
                    });
                });


                var testSuit = function () {
                    expect(settings.field.checkMap).toHaveBeenCalledWith(figureMap);
                    expect(figure.setMap).toHaveBeenCalledWith(figureMap);
                    expect(settings.canvas.updateElement).toHaveBeenCalledWith(figureMap);
                };


                it('should call down, checkMap, setMap and updateElement', function () {
                    tetris.down();
                    expect(figure.moveDown).toHaveBeenCalled();
                    testSuit();
                });

                it('should call left, checkMap, setMap and updateElement', function () {
                    tetris.left();
                    expect(figure.moveLeft).toHaveBeenCalled();
                    testSuit();
                });

                it('should call right, checkMap, setMap and updateElement', function () {
                    tetris.right();
                    expect(figure.moveRight).toHaveBeenCalled();
                    testSuit();
                });

                it('should call rotate, checkMap, setMap and updateElement', function () {
                    tetris.rotate();
                    expect(figure.rotate).toHaveBeenCalled();
                    testSuit();
                });
            });

            describe('Methods on failed map checks', function () {
                beforeEach(function () {
                    settings.field.checkMap = function () { return 0; };
                });

                var testSuit = function () {
                    expect(figure.setMap).not.toHaveBeenCalled();
                    expect(settings.canvas.updateElement).not.toHaveBeenCalled();
                };

                it('should not call setMap and updateElement on trying moveDown figure', function () {
                    tetris.down();
                    testSuit();
                });

                it('should not call setMap and updateElement on trying moveLeft figure', function () {
                    tetris.left();
                    testSuit();
                });

                it('should not call setMap and updateElement on trying moveRight figure', function () {
                    tetris.right();
                    testSuit();
                });

                it('should not call setMap and updateElement on trying rotate figure', function () {
                    tetris.rotate();
                    testSuit();
                });
            });

            describe('Methods on map checks with lay resolution', function () {
                beforeEach(function () {
                    settings.field.checkMap = function () { return 2; };

                    spyOn(settings.field, 'layMap').and.callFake(function () {
                        return 1;
                    });
                    spyOn(settings.canvas, 'addElement');
                    spyOn(settings.canvas, 'removeElement');
                    spyOn(tetris, 'onLineStrike');
                    spyOn(tetris, 'onNewFigure').and.callThrough();
                });

                var testSuit = function () {
                    expect(figure.setMap).not.toHaveBeenCalled();
                    expect(settings.canvas.removeElement).toHaveBeenCalledWith(figureMap);
                    expect(settings.field.layMap).toHaveBeenCalledWith(figureMap);
                    expect(tetris.onLineStrike).toHaveBeenCalledWith(1);

                    expect(settings.canvas.updateElement).toHaveBeenCalledWith(fieldMap);
                    expect(tetris.onNewFigure).toHaveBeenCalled();
                    expect(settings.canvas.addElement).toHaveBeenCalledWith(figureMap);
                };

                it('should not call setMap but should remove figure from canvas, lay it with proper result and update field on canvas on moveDown figure', function () {
                    tetris.down();
                    testSuit();
                });

                it('should not call setMap but should remove figure from canvas, lay it with proper result and update field on canvas on moveLeft figure', function () {
                    tetris.left();
                    testSuit();
                });

                it('should not call setMap but should remove figure from canvas, lay it with proper result and update field on canvas on moveRight figure', function () {
                    tetris.right();
                    testSuit();
                });

                it('should not call setMap but should remove figure from canvas, lay it with proper result and update field on canvas on rotate figure', function () {
                    tetris.rotate();
                    testSuit();
                });
            });

            describe('Finish resolution', function () {
                beforeEach(function () {
                    settings.field.checkMap = function () { return -1; };

                    spyOn(settings.field, 'layMap').and.callFake(function () {});
                    spyOn(settings.canvas, 'addElement');
                    spyOn(settings.canvas, 'removeElement');
                    spyOn(tetris, 'onLineStrike');
                    spyOn(tetris, 'onFinish');
                    spyOn(tetris, 'onNewFigure');
                });

                it('should call removeElement, layMap, updateFiled and onFinish', function () {
                    tetris.down();
                    expect(figure.setMap).not.toHaveBeenCalled();
                    expect(settings.canvas.removeElement).toHaveBeenCalledWith(figureMap);
                    expect(settings.field.layMap).toHaveBeenCalledWith(figureMap);

                    expect(settings.canvas.updateElement).toHaveBeenCalledWith(fieldMap);
                    expect(tetris.onNewFigure).not.toHaveBeenCalled();
                    expect(settings.canvas.addElement).not.toHaveBeenCalled();
                    expect(tetris.onFinish).toHaveBeenCalled();
                });

            });
        });
    });
});