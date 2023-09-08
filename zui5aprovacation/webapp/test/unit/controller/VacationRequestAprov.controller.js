/*global QUnit*/

sap.ui.define([
	"polar/zui5aprovacation/controller/VacationRequestAprov.controller"
], function (Controller) {
	"use strict";

	QUnit.module("VacationRequestAprov Controller");

	QUnit.test("I should test the VacationRequestAprov controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
