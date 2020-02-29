/**
 * Created by vis on 27/05/15.
 */

var config = require('../config/general');

exports.controller = function(req, res){
    res.render('controller', { title: config.title, sources: config.feedSources });
};