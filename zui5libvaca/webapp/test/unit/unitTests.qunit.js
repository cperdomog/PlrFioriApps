/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"polar/zui5libvaca/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
