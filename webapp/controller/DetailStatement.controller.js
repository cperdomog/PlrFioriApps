sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller}  Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("polar.zui5statement.controller.DetailStatement", {
            onInit: function () {
                var oViewModel = new JSONModel();
                this.getView().setModel(oViewModel, "detailstatementView");                
                sap.ui.core.UIComponent.getRouterFor(this).getRoute("detailstatement").attachPatternMatched(this.onObjectMatched, this);
            },
            onObjectMatched: function (oEvent) {
                this.onStartView();
            },

            onStartView: function () {
                var seqnr = this.getOwnerComponent().getModel("detailstatement").getProperty("/Seqnr");
                var tipo = "01";
                var dataStatement = tipo + "$" + seqnr;
                var pdfViewer = this.getView().byId("reciboPdf");
                pdfViewer.setSource("/sap/opu/odata/sap/ZHR_CO_FIORI_ESS_SRV/ZHRS_CO_UI_PDFSet(Tipof='"+ tipo +"',Clave='"+ seqnr +"')/$value");
                pdfViewer.setTitle("Recibo de salario");
            },
            onNavBack: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this),
                    bReplace = true;
                oRouter.navTo("liststatement", {}, bReplace);
            }



        });
    });