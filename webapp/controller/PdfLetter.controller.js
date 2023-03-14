sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("polar.zui5certingret.controller.PdfLetter", {
            onInit: function () {
                var oViewModel = new JSONModel();
                this.getView().setModel(oViewModel, "pdfletterView");
                sap.ui.core.UIComponent.getRouterFor(this).getRoute("pdfletter").attachPatternMatched(this.onObjectMatched, this);
            },
            onObjectMatched: function (oEvent) {
                this.onStartView();

            },
            onStartView: async function() {
                await this.onValidateService(this);
                await this.onLoadPdf();
                
            },

            onLoadPdf: async function(){
                var tipo = "03";
                var clave = "";
                var pdfViewer = this.getView().byId("letterPdf");
                pdfViewer.setSource("/sap/opu/odata/sap/ZHR_CO_FIORI_ESS_SRV/ZHRS_CO_UI_PDFSet(Tipof='"+ tipo +"',Clave='"+ clave +"')/$value");
                pdfViewer.setTitle("Carta de trabajo");
            },

            onValidateService: async  function(myThis){
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZHR_CO_FIORI_ESS_SRV/");
                oModel.setHeaders({
                    "X-Requested-With": "X"
                });
                var entryUrl = "/ZHRT_UI_C_IN_RETSet";
                oModel.read(entryUrl, {
                    method: "GET",
                    success: function (data) {
                        var oModelServActiv = myThis.getOwnerComponent().getModel("servactiv");
                        oModelServActiv.setData(data);
                        if (data.results[0].Activ){
                            var oContainer = myThis.getView().byId("SContainer");
                            oContainer.setVisible(true);
                            var messagePage = myThis.getView().byId("messagePage");
                            messagePage.setVisible(false);
                        }else{
                            var oContainer = myThis.getView().byId("SContainer");
                            oContainer.setVisible(false);
                            var messagePage = myThis.getView().byId("messagePage");
                            messagePage.setVisible(true);
                        }
                        sap.ui.getCore().setModel(oModelServActiv);
                        dialog.close();
                    },
                    error: function () {
                        dialog.close();
                    }
                })
            }
        });
    });
