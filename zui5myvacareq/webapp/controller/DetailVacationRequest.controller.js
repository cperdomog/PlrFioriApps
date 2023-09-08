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

    return Controller.extend("polar.zui5myvacareq.controller.DetailVacationRequest", {
      onInit: function () {
        var oViewModel = new JSONModel();
        this.getView().setModel(oViewModel, "detailvacationrequestView");
        sap.ui.core.UIComponent.getRouterFor(this).getRoute("detailvacationrequest").attachPatternMatched(this.onObjectMatched, this);
      },
      onObjectMatched: function (oEvent) {
        this.onStartView();
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

      onDisableScreen: function () {
        this.byId("id_inivac").setEditable(false);
        this.byId("id_finvac").setEditable(false);
        this.byId("id_absdays").setEditable(false);
        this.byId("id_selldays").setEditable(false);
      },

      onGetDetail: function () {
        var Begda = this.getOwnerComponent().getModel("detailvacationrequest").getProperty("/Begda");
        var Endda = this.getOwnerComponent().getModel("detailvacationrequest").getProperty("/Endda");
        var begdaDate = Begda.slice(6, 10) + Begda.slice(3, 5) + Begda.slice(0, 2);
        var enddaDate = Endda.slice(6, 10) + Endda.slice(3, 5) + Endda.slice(0, 2);
        var Diasd = this.getOwnerComponent().getModel("detailvacationrequest").getProperty("/Diasd");
        var Diasv = this.getOwnerComponent().getModel("detailvacationrequest").getProperty("/Diasv");
        var Namap = this.getOwnerComponent().getModel("detailvacationrequest").getProperty("/Namap");
        var Estat = this.getOwnerComponent().getModel("detailvacationrequest").getProperty("/Estat");
        this.byId("id_inivac").setValue(begdaDate);
        this.byId("id_finvac").setValue(enddaDate);
        this.byId("id_absdays").setValue(Diasd);
        this.byId("id_selldays").setValue(Diasv);
        if (Diasv == 0) {
          this.byId("id_selldays").setValue(0);
        }
        this.byId("id_nameAprov").setValue(Namap);
        this.onDisableScreen();
        if (Estat === "01") {
          this.byId("BtnEdit").setVisible(true);
          this.byId("BtnSave").setVisible(false);
          this.byId("BtnValid").setVisible(false);
        } else {
          this.byId("BtnEdit").setVisible(false);
          this.byId("BtnSave").setVisible(false);
          this.byId("BtnValid").setVisible(false);
        }
      },
      onStartView: function () {
        this.byId("id_inivac").setValueFormat("yyyyMMdd");
        this.byId("id_finvac").setValueFormat("yyyyMMdd");
        this.onListQuota(this);
        this.onGetDetail();
      },
      onEditMode: function () {
        this.byId("id_inivac").setEditable(true);
        this.byId("id_absdays").setEditable(true);
        this.byId("id_selldays").setEditable(true);
        this.byId("BtnSave").setVisible(true);
        this.byId("BtnEdit").setVisible(false);
        this.byId("BtnValid").setVisible(true);
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
        var Aprob = this.getOwnerComponent().getModel("detailvacationrequest").getProperty("/Aprob");
        entryData.Aprob = Aprob;
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
        this.onProcessRequest("3");
      },
      onNumber: function (oEvent) {
        var oInput = oEvent.getSource();
        var value = oInput.getValue();
        value = value.replace(/[^\d]/g, '');
        oInput.setValue(value);
      },
      onSendVacation: async function () {
        var myThis = this;
        MessageBox.confirm("Esta seguro de guardar la solicitud", {
          onClose: function (sAction) {
            if ( sAction === 'OK' ){   
              myThis.onProcessRequest("4");           
            }
          }
        });
        
      }
    });
  });