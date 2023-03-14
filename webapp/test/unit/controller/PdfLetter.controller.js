/*global QUnit*/

sap.ui.define([
	"polar/zui5certingret/controller/PdfLetter.controller"
], function (Controller) {
	"use strict";

	QUnit.module("PdfLetter Controller");

	QUnit.test("I should test the PdfLetter controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
