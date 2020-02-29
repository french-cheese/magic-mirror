//jQuery extension to fetch an rss feed and return it as json via YQL
//created by dboz@airshp.com
(function($) {
  
	$.extend({
		feedToJson: function(options, callback) {
			if ($.isFunction(options)) {
			  callback = options;
			  options = null;
			}
			options = $.extend($.feedToJson.defaults,options);
			var url = options.yqlURL + encodeURIComponent(options.feed);
			return $.getJSON(url, function(data){
					//console.log(data);
					$.isFunction(callback) && callback(data); //allows the callback function to be the only option
					$.isFunction(options.success) && options.success(data);
				}); 
		}
	});
  
  //defaults
  $.feedToJson.defaults = {
  	yqlURL : ' https://api.rss2json.com/v1/api.json?rss_url=',  //yql
  	feed:'http://instagr.am/tags/tacos/feed/recent.rss', //instagram recent posts tagged 'tacos'
  }; 
  
})(jQuery);
// eo feedToJson


