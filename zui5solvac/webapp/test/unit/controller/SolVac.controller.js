/*global QUnit*/

sap.ui.define([
	"polar/zui5solvac/controller/SolVac.controller"
], function (Controller) {
	"use strict";

	QUnit.module("SolVac Controller");

	QUnit.test("I should test the SolVac controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
