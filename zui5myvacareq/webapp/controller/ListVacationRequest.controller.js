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

    return Controller.extend("polar.zui5myvacareq.controller.ListVacationRequest", {
      onInit: function () {
        var oViewModel = new JSONModel();
        this.getView().setModel(oViewModel, "listvacationrequestView");
        sap.ui.core.UIComponent.getRouterFor(this).getRoute("listvacationrequest").attachPatternMatched(this.onObjectMatched, this);
      },
      onObjectMatched: function (oEvent) {
        this.onValidateServ(this); 
        this.onStartView();
      },
      onStartView: function () {
        this.onListVacation(this);
      },
      onValidateServ: function(myThis){
        var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZHR_CO_FIORI_ESS_SRV/");
        oModel.setHeaders({
          "X-Requested-With": "X"
        });
        var entryUrl = "/ZHRS_CO_UI_VALIDATE_SERVSet(Servi='06')";
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
      onListVacation: function (myThis) {
        var dialog = new sap.m.BusyDialog();
        var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZHR_CO_FIORI_ESS_SRV/");
        oModel.setHeaders({
          "X-Requested-With": "X"
        });
        var entryUrl = "/ZHRS_CO_UI_SOLVACSet";
        oModel.read(entryUrl, {
          method: "GET",
          success: function (data) {
            var oModelListVacaSend = myThis.getOwnerComponent().getModel("listvacasend");
            var oModelListVacaRejec = myThis.getOwnerComponent().getModel("listvacarejec");
            var oModelListVacaAprob = myThis.getOwnerComponent().getModel("listvacaaprob");
            var oModelCount = myThis.getOwnerComponent().getModel("count");
            var oModelListVacaTotal = myThis.getOwnerComponent().getModel("listvacatotal");
            var oModelListVacaProce = myThis.getOwnerComponent().getModel("listvacaproce");
            var dataSend = {
              results: {},
            };
            var dataRejec = {
              results: {},
            };
            var dataAprob = {
              results: {},
            };
            var dataTotal = {
              results: {},
            };
            var dataProce = {
              results: {},
            };
            jQuery.sap.require("sap.ui.core.format.DateFormat");
            var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
              pattern: "dd/MM/yyyy"
            });
            var totalSend = 0;
            var totalRejec = 0;
            var totalAprob = 0;
            var totalProce = 0;
            var total = 0;
            for (var line = 0; line < data.results.length; line++) {
              data.results[line].Fecin1 = oDateFormat.format(data.results[line].Fecin1);
              data.results[line].Fecfi1 = oDateFormat.format(data.results[line].Fecfi1); 
              total++;  
              dataTotal.results[line] = data.results[line];
              if ((data.results[line].Estat === "01") || (data.results[line].Estat === "02")) {
                dataSend.results[line] = data.results[line];
                totalSend++;
              };
              if ((data.results[line].Estat === "04") || (data.results[line].Estat === "05")) {
                dataRejec.results[line] = data.results[line];
                totalRejec++;
              };
              if (data.results[line].Estat === "03") {
                dataAprob.results[line] = data.results[line];
                totalAprob++;
              };
              if (data.results[line].Estat === "06") {
                dataProce.results[line] = data.results[line];
                totalProce++;
              };
            }
            oModelCount.setProperty("/Total", total);
            oModelCount.setProperty("/TotalSend", totalSend);
            oModelCount.setProperty("/TotalAprob", totalAprob);
            oModelCount.setProperty("/TotalProce", totalProce);
            oModelCount.setProperty("/TotalRejec", totalRejec);
            oModelListVacaTotal.setData(dataTotal);
            oModelListVacaSend.setData(dataSend);
            oModelListVacaRejec.setData(dataRejec);
            oModelListVacaAprob.setData(dataAprob);
            oModelListVacaProce.setData(dataProce);
            sap.ui.getCore().setModel(oModelListVacaTotal);
            sap.ui.getCore().setModel(oModelListVacaSend);
            sap.ui.getCore().setModel(oModelListVacaRejec);
            sap.ui.getCore().setModel(oModelListVacaAprob);
            sap.ui.getCore().setModel(oModelListVacaProce);
            dialog.close();
          },
          error: function () {
            dialog.close();
          }
        })

      },

      onDetail: function(oEvent, nameTable){
        var oItem = oEvent.getSource().getBindingContext(nameTable);
        var Begda = oItem.getProperty("Fecin1");
        var Endda = oItem.getProperty("Fecfi1");
        var Aprob = oItem.getProperty("Aprob");
        var Namap = oItem.getProperty("Namap");
        var Diasd = oItem.getProperty("Diasd");
        var Diasv = oItem.getProperty("Diasv");
        var Estat = oItem.getProperty("Estat");
        this.getOwnerComponent().getModel("detailvacationrequest").setProperty("/Begda", Begda);
        this.getOwnerComponent().getModel("detailvacationrequest").setProperty("/Endda", Endda);
        this.getOwnerComponent().getModel("detailvacationrequest").setProperty("/Aprob", Aprob);
        this.getOwnerComponent().getModel("detailvacationrequest").setProperty("/Namap", Namap);
        this.getOwnerComponent().getModel("detailvacationrequest").setProperty("/Diasd", Diasd);
        this.getOwnerComponent().getModel("detailvacationrequest").setProperty("/Diasv", Diasv);
        this.getOwnerComponent().getModel("detailvacationrequest").setProperty("/Estat", Estat);
      },


      onListVacaTotalPress: function(oEvent) {
        this.onDetail(oEvent, "listvacatotal");
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("detailvacationrequest");
      },
      onListVacaProcePress: function(oEvent) {
        this.onDetail(oEvent, "listvacaproce");
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("detailvacationrequest");
      },
      onListVacaSendPress: function(oEvent) {
        this.onDetail(oEvent, "listvacasend");
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("detailvacationrequest");
      },
      onListVacaAprobPress: function(oEvent) {
        this.onDetail(oEvent, "listvacaaprob");
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("detailvacationrequest");
      },
      onListVacaRejecPress: function(oEvent) {
        this.onDetail(oEvent, "listvacarejec");
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("detailvacationrequest");
      }
    });
  });
