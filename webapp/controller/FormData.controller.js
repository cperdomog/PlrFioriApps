sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.m.MessageBox} MessageBox
     */
    function (Controller, JSONModel, MessageBox) {
        "use strict";

        return Controller.extend("polar.zui5cesantia.controller.FormData", {
            onInit: function () {
                var oViewModel = new JSONModel();
                this.getView().setModel(oViewModel, "formdataView");
                sap.ui.core.UIComponent.getRouterFor(this).getRoute("formdata").attachPatternMatched(this.onObjectMatched, this);
            },
            onObjectMatched: function (oEvent) {
                this.onValidateServ(this);    
                this.onStartView(this);

            },

            onValidateServ: function(myThis){
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZHR_CO_FIORI_ESS_SRV/");
                oModel.setHeaders({
                  "X-Requested-With": "X"
                });
                var entryUrl = "/ZHRS_CO_UI_VALIDATE_SERVSet(Servi='03')";
                oModel.read(entryUrl, {
                  method: "GET",
                  success: function (data) {
                    var oValidateServ = myThis.getOwnerComponent().getModel("validateserv");
                    oValidateServ.setData(data);
                    sap.ui.getCore().setModel(oValidateServ);
                    if (data.Activ){
                      myThis.byId('page').setVisible(true);
                      myThis.byId('pageMessage').setVisible(false);
                    }else{
                      myThis.byId('page').setVisible(false);
                      myThis.byId('pageMessage').setVisible(true);
                    } 
                    },
                  error: function () {
                  }
                })  
              },

            onValidateService: async  function(myThis){
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZHR_CO_FIORI_ESS_SRV/");
                oModel.setHeaders({
                    "X-Requested-With": "X"
                });
                var date = new Date();
                var begda = date.toJSON().slice(0, 10);
                var entryUrl = "/ZHRS_CO_UI_CESANTIASet(Begtx='" + begda + "',Endtx='" + begda + "')";
                oModel.read(entryUrl, {
                    method: "GET",
                    success: function (data) {
//                        var oModelData= myThis.getOwnerComponent().getModel("formdata");
//                        oModelData.setData(data);
//                        var oCurrencyFormat = sap.ui.core.format.NumberFormat.getCurrencyInstance({
//                            "decimalSeparator": ",",
//                            "groupingSeparator": "."
//                          });                         
//                          var betrg = oCurrencyFormat.format(data.Basem);
//                          data.Basem = betrg;
//                          betrg = oCurrencyFormat.format(data.Based);
//                          data.Based = betrg;
//                          betrg = oCurrencyFormat.format(data.Cesad);
//                          data.Cesad = betrg;
//                          betrg = oCurrencyFormat.format(data.Inter);
//                          data.Inter = betrg;
//                          betrg = oCurrencyFormat.format(data.Total);
//                          data.Total = betrg;
//                          sap.ui.getCore().setModel(oModelData);
                    },
                    error: function () {
                        var oJsonError = JSON.parse(error.responseText);
                        var sMsgText = oJsonError.error.message.value;
                        MessageBox.error(sMsgText);
                    }
                })
            },
            onLoadPdf: async function(){
                var tipo = "05";
                var clave = "";
                var pdfViewer = this.getView().byId("cesantiaPdf");
                pdfViewer.setSource("/sap/opu/odata/sap/ZHR_CO_FIORI_ESS_SRV/ZHRS_CO_UI_PDFSet(Tipof='"+ tipo +"',Clave='"+ clave +"')/$value");
                pdfViewer.setTitle("Cesantía");
            },

            onStartView: async function(myThis) {
                await this.onValidateService(this);
                await this.onLoadPdf();
                 
            }
        });
    });
