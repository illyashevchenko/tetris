/**
 * Created by Illia_Shevchenko on 31.08.2015.
 */
'use strict';

import Game from '../../../models/game';

export default function (req, res) {
    let params = Object.assign({}, req.query, req.params);

    Game.findByQuery(params)
        .then(res.send.bind(res));
}