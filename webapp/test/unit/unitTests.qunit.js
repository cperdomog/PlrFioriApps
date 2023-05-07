/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"polar/zui5depretfuent/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
