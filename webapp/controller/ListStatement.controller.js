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

    return Controller.extend("polar.zui5statement.controller.ListStatement", {
      onInit: function () {
        var oViewModel = new JSONModel();
        this.getView().setModel(oViewModel, "liststatementView");
        this.onStartView();
        this._start = true;
        sap.ui.core.UIComponent.getRouterFor(this).getRoute("liststatement").attachPatternMatched(this.onObjectMatched, this);
      },
      onObjectMatched: function (oEvent) {
        if (this._start !== true) {
          this.onStartView();
          this._start = true;
        }
      },

      onStartView: function () {
        this.onListStatement(this);
      },

      onFilterPeriodos: function (oEvent) {
        var aFilter = [];
        var sQuery = oEvent.getParameter("query");
        var oList = this.getView().byId("tableSalaryStatement");
        var oBinding = oList.getBinding("items");
        if (sQuery) {
          aFilter.push(new Filter("Perio", FilterOperator.Contains, sQuery));
        }
        oBinding.filter(aFilter);
      },

      onListStatementPress: function (oEvent) {
        var oItem = oEvent.getSource().getBindingContext("liststatement");
        var Seqnr = oItem.getProperty("Seqnr");
        this.getOwnerComponent().getModel("detailstatement").setProperty("/Seqnr", Seqnr);
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this),
          bReplace = true;
        oRouter.navTo("detailstatement", {}, bReplace);
      },

      onListStatement: function (myThis) {
        var dialog = new sap.m.BusyDialog();
        var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZHR_CO_FIORI_ESS_SRV/");
        oModel.setHeaders({
          "X-Requested-With": "X"
        });
        var entryUrl = "/ZHRS_CO_UI_LIST_RECIBOSSet";
        oModel.read(entryUrl, {
          method: "GET",
          success: function (data) {
            var oModelListStatemet = myThis.getOwnerComponent().getModel("liststatement");
            oModelListStatemet.setData(data);
            var oCurrencyFormat = sap.ui.core.format.NumberFormat.getCurrencyInstance({
              "decimalSeparator": ",",
              "groupingSeparator": "."
            });
            for (var line = 0; line < data.results.length; line++) {
              var betrg = oCurrencyFormat.format(data.results[line].Bruto);
              data.results[line].Bruto = betrg;
              betrg = oCurrencyFormat.format(data.results[line].Netop);
              data.results[line].Netop = betrg;
              betrg = oCurrencyFormat.format(data.results[line].Deduc);
              data.results[line].Deduc = betrg;
            }
            sap.ui.getCore().setModel(oModelListStatemet);
            dialog.close();
          },
          error: function () {
            dialog.close();
          }
        })

      }
    });
  });
