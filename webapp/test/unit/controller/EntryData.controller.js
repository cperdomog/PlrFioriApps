/*global QUnit*/

sap.ui.define([
	"polar/zuidepretfuent/controller/EntryData.controller"
], function (Controller) {
	"use strict";

	QUnit.module("EntryData Controller");

	QUnit.test("I should test the EntryData controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
