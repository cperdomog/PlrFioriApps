sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.m.MessageBox} MessageBox
     * @param {typeof sap.m.MessageToast} MessageToast
     */
    function (Controller, JSONModel, MessageBox, MessageToast) {
        "use strict";

        return Controller.extend("polar.zui5depretfuent.controller.PdfForm", {
            onInit: function () {
                var oViewModel = new JSONModel();
                this.getView().setModel(oViewModel, "pdfformView");
                sap.ui.core.UIComponent.getRouterFor(this).getRoute("pdfform").attachPatternMatched(this.onObjectMatched, this);

            },
            onObjectMatched: function (oEvent) {
                this.onStartView();
            },
            onStartView: function () {
                var begda = this.getOwnerComponent().getModel("entrydata").getProperty("/Begda");
                var endda = this.getOwnerComponent().getModel("entrydata").getProperty("/Endda");
                var tipo = "04";
                var pdfViewer = this.getView().byId("formPdf");
                pdfViewer.setSource("/sap/opu/odata/sap/ZHR_CO_FIORI_ESS_SRV/ZHRS_CO_UI_PDFSet(Tipof='"+ tipo +"',Clave='"+ begda + endda +"')/$value");
                pdfViewer.setTitle("Depuración de la fuente");
            },
            onNavBack: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this),
                    bReplace = true;
                oRouter.navTo("entrydata", {}, bReplace);
            }

        });
    });