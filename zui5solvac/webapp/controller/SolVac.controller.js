sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/MessageBox"
],
  /**
 * @param {typeof sap.ui.core.mvc.Controller} Controller
 * @param {typeof sap.ui.model.json.JSONModel} JSONModel
 * @param {typeof sap.ui.model.Filter} Filter
 * @param {typeof sap.ui.model.FilterOperator} FilterOperator
 * @param {typeof sap.m.MessageBox} MessageBox
   */
  function (Controller, JSONModel, Filter, FilterOperator, MessageBox) {
    "use strict";

    return Controller.extend("polar.zui5solvac.controller.SolVac", {
      onInit: function () {
        var oViewModel = new JSONModel();
        this.getView().setModel(oViewModel, "solvacView");
        this.onStartView();
        this._start = true;
        this._appr = '';
        this._ok = '';
        sap.ui.core.UIComponent.getRouterFor(this).getRoute("solvac").attachPatternMatched(this.onObjectMatched, this);
      },
      onObjectMatched: function (oEvent) {
        if (this._start !== true) {
          this.onStartView();
          this._start = true;
        }
      },
      onStartView: function () {
        this.onValidateServ(this);
        this.onListQuota(this);
        this.onGetAppr(this);
      },
      onValidateServ: function(myThis){
        var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZHR_CO_FIORI_ESS_SRV/");
        oModel.setHeaders({
          "X-Requested-With": "X"
        });
        var entryUrl = "/ZHRS_CO_UI_VALIDATE_SERVSet(Servi='05')";
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
      onGetAppr: function (myThis) {
        var dialog = new sap.m.BusyDialog();
        var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZHR_CO_FIORI_ESS_SRV/");
        oModel.setHeaders({
          "X-Requested-With": "X"
        });
        var proceso = '1'
        var entryUrl = "/ZHRS_CO_UI_APROSet('" + proceso + "')";
        oModel.read(entryUrl, {
          method: "GET",
          success: function (data) {
            myThis.byId("id_nameAprov").setValue(data.Ename);
            myThis._appr = data.Pernr;
          },
          error: function () {

          }
        });
      },

      onListQuota: function (myThis) {
        var dialog = new sap.m.BusyDialog();
        var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZHR_CO_FIORI_ESS_SRV/");
        oModel.setHeaders({
          "X-Requested-With": "X"
        });
        var entryUrl = "/ZHRS_CO_UI_CONT_VACSet";
        oModel.read(entryUrl, {
          method: "GET",
          success: function (data) {
            var oModelListQuota = myThis.getOwnerComponent().getModel("listquota");
            oModelListQuota.setData(data);
            sap.ui.getCore().setModel(oModelListQuota);
            dialog.close();
          },
          error: function (error) {
            dialog.close();
            var oJsonError = JSON.parse(error.responseText);
            var sMsgText = oJsonError.error.message.value;
            MessageBox.error(sMsgText);

          }
        })

      },

      onProcessRequest: function (option) {
        var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZHR_CO_FIORI_ESS_SRV/");
        oModel.setHeaders({
          "X-Requested-With": "X"
        });
        var entryData = {};
        entryData.Solic = '';
        entryData.Namso = '';
        entryData.Estat = '';
        entryData.Fecin = this.byId("id_inivac").getDateValue();
        entryData.Diasd = this.byId("id_absdays").getValue();
        entryData.Diasv = this.byId("id_selldays").getValue();
        entryData.Fechs = new Date();
        entryData.Opcio = option;
        entryData.Aprob = this._appr;
        jQuery.sap.require("sap.ui.core.format.DateFormat");
        var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
          pattern: "yyyyMMdd"
        });
        entryData.Fechs = oDateFormat.format(entryData.Fechs);
        entryData.Fecin = oDateFormat.format(entryData.Fecin);
        this.byId("id_finvac").setValueFormat("yyyyMMdd");
        var entryUrl = "/ZHRS_CO_UI_SOLVACSet";
        //var entryUrl = "/ZHRS_CO_UI_SOLVACSet(Solic='" + entryData.Solic + "',Namso='" + entryData.Namso + "',Fechs=" + entryData.Fechs + ",Estat='" + entryData.Estat + "')";
        oModel.setDefaultBindingMode("TwoWay");
        var myThis = this;
        oModel.create(entryUrl, entryData, {
          method: "POST",
          success: function (data) {
            myThis.byId("id_finvac").setValue(data.Fecfi);
            myThis._ok = true;
            MessageBox.success(data.Messa);
          },
          error: function (error) {
            myThis._ok = false;
            var oJsonError = JSON.parse(error.responseText);
            var sMsgText = oJsonError.error.message.value;
            MessageBox.error(sMsgText);
          }
        })
      },

      onValidateVacation: async function () {
        this.onProcessRequest("1");
      },
      onNumber: function (oEvent) {
        var oInput = oEvent.getSource();
        var value = oInput.getValue();
        value = value.replace(/[^\d]/g, '');
        oInput.setValue(value);
      },
      onSendVacation: async function () {
        var myThis = this;
        MessageBox.confirm("¿Esta seguro de guardar la solicitud?", {
          onClose: function (sAction) {
            if (sAction === 'OK') {
              myThis.onProcessRequest("2");
            }
          }
        });
      }
    });
  });
