/*global QUnit*/

sap.ui.define([
	"polar/zui5myvacareq/controller/ListVacationRequest.controller"
], function (Controller) {
	"use strict";

	QUnit.module("ListVacationRequest Controller");

	QUnit.test("I should test the ListVacationRequest controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
