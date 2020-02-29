var config = require('../config/general');
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: config.title });
};