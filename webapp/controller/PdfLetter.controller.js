sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     */
    function (Controller,JSONModel) {
        "use strict";

        return Controller.extend("polar.zui5letter.controller.PdfLetter", {
            onInit: function () {
                var oViewModel = new JSONModel();
                this.getView().setModel(oViewModel, "pdfletterView");
                sap.ui.core.UIComponent.getRouterFor(this).getRoute("pdfletter").attachPatternMatched(this.onObjectMatched, this);
            },
            onObjectMatched: function (oEvent) {
                this.onStartView();
            },
            onStartView: function () {
                var optionLetter = this.getOwnerComponent().getModel("entryletter").getProperty("/OptLetter");
                var tipo = "02";
                var dataStatement = tipo + "$" + optionLetter;
                var pdfViewer = this.getView().byId("letterPdf");
                pdfViewer.setSource("/sap/opu/odata/sap/ZHR_CO_FIORI_ESS_SRV/ZHRS_CO_UI_PDFSet(Tipof='"+ tipo +"',Clave='"+ optionLetter +"')/$value");
//                pdfViewer.setSource("/sap/opu/odata/sap/ZHR_CO_FIORI_ESS_SRV/ZHRS_CO_UI_PDFSet(Tipof='02',Clave='04')/$value");
                pdfViewer.setTitle("Carta de trabajo");
            },
            onNavBack: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this),
                    bReplace = true;
                oRouter.navTo("entryletter", {}, bReplace);
            }
        });
    });