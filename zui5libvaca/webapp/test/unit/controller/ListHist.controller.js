/*global QUnit*/

sap.ui.define([
	"polar/zui5libvaca/controller/ListHist.controller"
], function (Controller) {
	"use strict";

	QUnit.module("ListHist Controller");

	QUnit.test("I should test the ListHist controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
