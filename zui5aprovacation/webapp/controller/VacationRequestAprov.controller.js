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

        return Controller.extend("polar.zui5aprovacation.controller.VacationRequestAprov", {
            onInit: function () {
                var oViewModel = new JSONModel();
                this.getView().setModel(oViewModel, "vacationrequestaprovView");
                sap.ui.core.UIComponent.getRouterFor(this).getRoute("vacationrequestaprov").attachPatternMatched(this.onObjectMatched, this);
            },
            onObjectMatched: function (oEvent) {
                this.byId("idAppSplitControl").setHomeIcon({
                    'phone': 'phone-icon.png',
                    'tablet': 'tablet-icon.png',
                    'icon': 'desktop.ico'
                });
                this.onValidateServ(this);  
                if ((sap.ui.Device.system.desktop) || (sap.ui.Device.system.tablet)) {
                    this.byId("detail").setShowNavButton(false);
                } else {
                    this.byId("detail").setShowNavButton(true);
                }
                this.onGetListVacationRequestAprov(this);
            },
            onGetListVacationRequestAprov: function (myThis) {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZHR_CO_FIORI_ESS_SRV/");
                oModel.setHeaders({
                    "X-Requested-With": "X"
                });
                var filters = new Array();
                filters.push(new sap.ui.model.Filter("Aprob", sap.ui.model.FilterOperator.EQ, "1"));
                var entryUrl = "/ZHRS_CO_UI_SOLVACSet";
                oModel.read(entryUrl, {
                    filters: filters,
                    method: "GET",
                    success: function (data) {
                        var oModelListVacationRequest = myThis.getOwnerComponent().getModel("listvacationrequest");
                        oModelListVacationRequest.setData(data);
                        sap.ui.getCore().setModel(oModelListVacationRequest);
                        var oList = myThis.byId("aprovList");
                        var oItems = myThis.byId("aprovList").getItems();
                        oList.setSelectedItem(oItems[0]);
                        var oItmeSelected = oItems[0].getBindingContext("listvacationrequest");
                        myThis.onGetDetail(oItmeSelected);
                    },
                    error: function () { }
                });

            },
            onValidateServ: function (myThis) {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZHR_CO_FIORI_ESS_SRV/");
                oModel.setHeaders({
                    "X-Requested-With": "X"
                });
                var entryUrl = "/ZHRS_CO_UI_VALIDATE_SERVSet(Servi='07')";
                oModel.read(entryUrl, {
                    method: "GET",
                    success: function (data) {
                        var oValidateServ = myThis.getOwnerComponent().getModel("validateserv");
                        oValidateServ.setData(data);
                        sap.ui.getCore().setModel(oValidateServ);
                        if (data.Activ) {
                            myThis.byId('idAppSplitControl').setVisible(true);
                            myThis.byId('pageMessage').setVisible(false);
                        } else {
                            myThis.byId('idAppSplitControl').setVisible(false);
                            myThis.byId('pageMessage').setVisible(true);
                        }
                    },
                    error: function () {
                    }
                })
            },
            onListQuota: function (myThis) {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZHR_CO_FIORI_ESS_SRV/");
                oModel.setHeaders({
                    "X-Requested-With": "X"
                });
                var solic = myThis.getOwnerComponent().getModel("detailvacationrequest").getProperty("/Solic");
                var filters = new Array();
                filters.push(new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, solic));
                var entryUrl = "/ZHRS_CO_UI_CONT_VACSet";
                oModel.read(entryUrl, {
                    filters: filters,
                    method: "GET",
                    success: function (data) {
                        var oModelListQuota = myThis.getOwnerComponent().getModel("listquota");
                        oModelListQuota.setData(data);
                        sap.ui.getCore().setModel(oModelListQuota);
                    },
                    error: function (error) {
                        var oJsonError = JSON.parse(error.responseText);
                        var sMsgText = oJsonError.error.message.value;
                        MessageBox.error(sMsgText);
                    }
                })
            },

            onProcessVacation: async function (oEvent) {
                var event = oEvent.getSource().mProperties.text;
                var myThis = this;
                MessageBox.confirm("¿Esta seguro de guardar los cambios?", {
                    onClose: function (sAction) {
                        if (sAction === 'OK') {
                            if (event == 'Aprobar') {
                                myThis.onProcessRequest("5");
                            } else {
                                myThis.onProcessRequest("6");
                            }
                        }
                    }
                });
            },

            onProcessRequest: function (option) {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZHR_CO_FIORI_ESS_SRV/");
                oModel.setHeaders({
                    "X-Requested-With": "X"
                });
                var entryData = {};
                entryData.Solic = this.getOwnerComponent().getModel("detailvacationrequest").getProperty("/Solic");
                entryData.Namso = '';
                entryData.Estat = this.getOwnerComponent().getModel("detailvacationrequest").getProperty("/Estat");
                entryData.Fechs = new Date();
                entryData.Opcio = option;
                entryData.Comen = this.byId("Comen").getValue();
                jQuery.sap.require("sap.ui.core.format.DateFormat");
                var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                    pattern: "yyyyMMdd"
                });
                entryData.Fechs = oDateFormat.format(entryData.Fechs);
                var entryUrl = "/ZHRS_CO_UI_SOLVACSet";
                //var entryUrl = "/ZHRS_CO_UI_SOLVACSet(Solic='" + entryData.Solic + "',Namso='" + entryData.Namso + "',Fechs=" + entryData.Fechs + ",Estat='" + entryData.Estat + "')";
                oModel.setDefaultBindingMode("TwoWay");
                var myThis = this;
                oModel.create(entryUrl, entryData, {
                    method: "POST",
                    success: function (data) {
                        myThis._ok = true;
                        //                        MessageBox.success(data.Messa);
                        MessageBox.success(data.Messa, {
                            onClose: function (sAction) {
                                if (sAction === 'OK') {
                                    window.location.reload();
                                }
                            }
                        });
                        //                        myThis.onGetListVacationRequestAprov(this);
                    },
                    error: function (error) {
                        myThis._ok = false;
                        var oJsonError = JSON.parse(error.responseText);
                        var sMsgText = oJsonError.error.message.value;
                        MessageBox.error(sMsgText);
                    }
                })
            },
            onGetDetail: function (oItem) {
                var plans = oItem.getProperty("PlansSol");
                var solic = oItem.getProperty("Solic");
                var nachn = oItem.getProperty("NachnSol");
                var vorna = oItem.getProperty("VornaSol");
                var fechs = oItem.getProperty("Fechs1");
                var fecin = oItem.getProperty("Fecin1");
                var fecfi = oItem.getProperty("Fecfi1");
                var diasd = oItem.getProperty("Diasd");
                var diasv = oItem.getProperty("Diasv");
                var estat = oItem.getProperty("Estat");
                var txtes = oItem.getProperty("Txtes");
                var comen = oItem.getProperty("Comen");
                if (estat == '02') {
                    this.byId("Comen").setEditable(true);
                    this.byId("aprov").setVisible(true);
                    this.byId("reject").setVisible(true);
                }
                if (diasv == 0) {
                    diasv = 0;
                }
                this.getOwnerComponent().getModel("detailvacationrequest").setProperty("/PlansSol", plans);
                this.getOwnerComponent().getModel("detailvacationrequest").setProperty("/Solic", solic);
                this.getOwnerComponent().getModel("detailvacationrequest").setProperty("/NachnSol", nachn);
                this.getOwnerComponent().getModel("detailvacationrequest").setProperty("/VornaSol", vorna);
                this.getOwnerComponent().getModel("detailvacationrequest").setProperty("/Fechs1", fechs);
                this.getOwnerComponent().getModel("detailvacationrequest").setProperty("/Fecin1", fecin);
                this.getOwnerComponent().getModel("detailvacationrequest").setProperty("/Fecfi1", fecfi);
                this.getOwnerComponent().getModel("detailvacationrequest").setProperty("/Diasd", diasd);
                this.getOwnerComponent().getModel("detailvacationrequest").setProperty("/Diasv", diasv);
                this.getOwnerComponent().getModel("detailvacationrequest").setProperty("/Txtes", txtes);
                this.getOwnerComponent().getModel("detailvacationrequest").setProperty("/Comen", comen);
                this.getOwnerComponent().getModel("detailvacationrequest").setProperty("/Estat", estat);
                this.onListQuota(this);
            },

            onPressMasterBack: function () {
                this.byId("idAppSplitControl").backMaster();
            },

            onFilterPersons: function (oEvent) {
                var aFilter = [];
                var sQuery = oEvent.getParameter("query");
                var oList = this.getView().byId("aprovList");
                var oBinding = oList.getBinding("items");
                if (sQuery) {
                    aFilter.push(new Filter("Namso", FilterOperator.Contains, sQuery));
                }
                oBinding.filter(aFilter);
            },

            onSelect: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("listItem");
                var oItem = oSelectedItem.getBindingContext("listvacationrequest");
                this.onGetDetail(oItem);
                this.byId("idAppSplitControl").to(this.createId("detail"));

            }
        });
    });
