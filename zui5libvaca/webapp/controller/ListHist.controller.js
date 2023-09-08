sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator"
],
  /**
 * @param {typeof sap.ui.core.mvc.Controller}  Controller
 * @param {typeof sap.ui.model.json.JSONModel} JSONModel
 * @param {typeof sap.ui.model.Filter} Filter
 * @param {typeof sap.ui.model.FilterOperator} FilterOperator
   */
  function (Controller, JSONModel, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("polar.zui5libvaca.controller.ListHist", {
      onInit: function () {
        var oViewModel = new JSONModel();
        this.getView().setModel(oViewModel, "listhistView");
        sap.ui.core.UIComponent.getRouterFor(this).getRoute("listhist").attachPatternMatched(this.onObjectMatched, this);
      },
      onObjectMatched: function (oEvent) {   
        this.onValidateServ(this);     
        this.onListHist(this);
        this.onHeader(this);
      },

      onValidateServ: function(myThis){
        var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZHR_CO_FIORI_ESS_SRV/");
        oModel.setHeaders({
          "X-Requested-With": "X"
        });
        var entryUrl = "/ZHRS_CO_UI_VALIDATE_SERVSet(Servi='08')";
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

      onHeader: function (myThis) {
        var dialog = new sap.m.BusyDialog();
        var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZHR_CO_FIORI_ESS_SRV/");
        oModel.setHeaders({
          "X-Requested-With": "X"
        });
        var entryUrl = "/ZHRS_CO_UI_ORG_DATASet(Pernr='00001')";
        oModel.read(entryUrl, {
          method: "GET",
          success: function (data) {
            var oModelHeaderEmp = myThis.getOwnerComponent().getModel("headeremp");
            oModelHeaderEmp.setData(data);
            sap.ui.getCore().setModel(oModelHeaderEmp);
            dialog.close();
          },
          error: function () {
            dialog.close();
          }
        })
      },

      onFilterPeriodos: function (oEvent) {
        var aFilter = [];
        var sQuery = oEvent.getParameter("query");
        var oList = this.getView().byId("tableVacationHist");
        var oBinding = oList.getBinding("items");
        if (sQuery) {
          aFilter.push(new Filter("Began", FilterOperator.Contains, sQuery));
        }
        oBinding.filter(aFilter);
      },

      onListHist: function (myThis) {
        var dialog = new sap.m.BusyDialog();
        var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZHR_CO_FIORI_ESS_SRV/");
        oModel.setHeaders({
          "X-Requested-With": "X"
        });
        var entryUrl = "/ZHRS_CO_UI_HISVACSet";
        oModel.read(entryUrl, {
          method: "GET",
          success: function (data) {
            var oModelListLibVaca = myThis.getOwnerComponent().getModel("listlibvaca");
            oModelListLibVaca.setData(data);
            var oCurrencyFormat = sap.ui.core.format.NumberFormat.getCurrencyInstance({
              "decimalSeparator": ",",
              "groupingSeparator": ".",
              "decimals": 5,
            });
            var totDidis = 0;
            var totDicom = 0;
            var totDiliq = 0;
            var totDipen = 0;
            totDidis = parseFloat(totDidis);
            totDicom = parseFloat(totDicom);
            totDiliq = parseFloat(totDiliq);
            totDipen = parseFloat(totDipen);
            for (var line = 0; line < data.results.length; line++) {
              data.results[line].Didis = parseFloat(data.results[line].Didis);
              data.results[line].Dicom = parseFloat(data.results[line].Dicom);
              data.results[line].Diliq = parseFloat(data.results[line].Diliq);
              data.results[line].Dipen = parseFloat(data.results[line].Dipen);
              totDidis = totDidis + data.results[line].Didis;
              totDicom = totDicom + data.results[line].Dicom;
              totDiliq = totDiliq + data.results[line].Diliq;
              totDipen = totDipen + data.results[line].Dipen;

              var dias = oCurrencyFormat.format(data.results[line].Didis);
              data.results[line].Didis = dias;
              dias = oCurrencyFormat.format(data.results[line].Dicom);
              data.results[line].Dicom = dias;
              dias = oCurrencyFormat.format(data.results[line].Diliq);
              data.results[line].Diliq = dias;
              dias = oCurrencyFormat.format(data.results[line].Dipen);
              data.results[line].Dipen = dias;
            }
            totDidis = oCurrencyFormat.format(totDidis);
            totDicom = oCurrencyFormat.format(totDicom);
            totDiliq = oCurrencyFormat.format(totDiliq);
            totDipen = oCurrencyFormat.format(totDipen);
            myThis.byId("totDidis").setText(totDidis);
            myThis.byId("totDicom").setText(totDicom);
            myThis.byId("totDiliq").setText(totDiliq);
            myThis.byId("totDipen").setText(totDipen);
            sap.ui.getCore().setModel(oModelListLibVaca);
            dialog.close();
          },
          error: function () {
            dialog.close();
          }
        })
      }
    });
  });
