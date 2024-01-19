/*\
title: $:/plugins/tiddlywiki/multiwikiserver/route-get-recipe-tiddlers-json.js
type: application/javascript
module-type: route

PUT /wikis/:recipe_name/recipes/:recipe_name/tiddlers.json?filter=:filter

NOTE: Urls currently include the recipe name twice. This is temporary to minimise the changes to the TiddlyWeb plugin

\*/
(function() {

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.method = "GET";

exports.path = /^\/wiki\/([^\/]+)\/recipes\/([^\/]+)\/tiddlers.json$/;

exports.handler = function(request,response,state) {
	// Get the  parameters
	var recipe_name = $tw.utils.decodeURIComponentSafe(state.params[0]),
		recipe_name_2 = $tw.utils.decodeURIComponentSafe(state.params[1]);
	if(recipe_name === recipe_name_2) {
		// Get the tiddlers in the recipe
		var titles = $tw.sqlTiddlerStore.getRecipeTiddlers(recipe_name);
		// Get a skinny version of each tiddler
		var tiddlers = [];
		$tw.utils.each(titles,function(title) {
			var tiddler = $tw.sqlTiddlerStore.getTiddler(title,recipe_name);
			tiddlers.push(Object.assign({},tiddler,{text: undefined, revision: "0", bag: "bag-gamma"}));
		});
		var text = JSON.stringify(tiddlers);
		state.sendResponse(200,{"Content-Type": "application/json"},text,"utf8");
		return;
	}
	// Fail if something went wrong
	response.writeHead(404);
	response.end();

};

}());