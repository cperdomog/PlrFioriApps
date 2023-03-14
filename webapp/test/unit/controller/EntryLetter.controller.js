/*global QUnit*/

sap.ui.define([
	"polar/zui5letter/controller/EntryLetter.controller"
], function (Controller) {
	"use strict";

	QUnit.module("EntryLetter Controller");

	QUnit.test("I should test the EntryLetter controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
