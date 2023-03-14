/*global QUnit*/

sap.ui.define([
	"polar/zui5statement/controller/ListStatement.controller"
], function (Controller) {
	"use strict";

	QUnit.module("ListStatement Controller");

	QUnit.test("I should test the ListStatement controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
