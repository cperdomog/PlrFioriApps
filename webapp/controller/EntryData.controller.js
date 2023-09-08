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

        return Controller.extend("polar.zui5depretfuent.controller.EntryData", {
            onInit: function () {
                var oViewModel = new JSONModel();
                this.getView().setModel(oViewModel, "entrydataView");
                this.oFormatYyyymmdd = sap.ui.core.format.DateFormat.getInstance({ pattern: "dd-MM-yyyy", calendarType: sap.ui.core.CalendarType.Gregorian });
                sap.ui.core.UIComponent.getRouterFor(this).getRoute("entrydata").attachPatternMatched(this.onObjectMatched, this);

            },
            onObjectMatched: function (oEvent) {
                var oCalendar = this.byId("calendar");
                this.onValidateServ(this);  
                if (sap.ui.Device.system.desktop) {
                    oCalendar.setWidth("50%");
                }
            },
            handleCalendarSelect: function (oEvent) {
                var oCalendar = oEvent.getSource();
                this._updateText(oCalendar.getSelectedDates()[0]);
            },
            _updateText: function (oSelectedDates) {
                var oSelectedDateFrom = this.byId("selectedDateFrom");
                var oSelectedDateTo = this.byId("selectedDateTo");
                var oDate;
                var nodateText = this.getView().getModel("i18n").getResourceBundle().getText("noDateSelected");
                if (oSelectedDates) {
                    oDate = oSelectedDates.getStartDate();
                    if (oDate) {
                        oSelectedDateFrom.setText(this.oFormatYyyymmdd.format(oDate));
                    } else {
                        oSelectedDateTo.setText(nodateText);
                    }
                    oDate = oSelectedDates.getEndDate();
                    if (oDate) {
                        oSelectedDateTo.setText(this.oFormatYyyymmdd.format(oDate));
                    } else {
                        oSelectedDateTo.setText(nodateText);
                    }
                } else {
                    oSelectedDateFrom.setText(nodateText);
                    oSelectedDateTo.setText(nodateText);
                }
            },
            onProcessData: async function () {
                await this.onValidateData(this);
            },

            onValidateServ: function (myThis) {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZHR_CO_FIORI_ESS_SRV/");
                oModel.setHeaders({
                    "X-Requested-With": "X"
                });
                var entryUrl = "/ZHRS_CO_UI_VALIDATE_SERVSet(Servi='04')";
                oModel.read(entryUrl, {
                    method: "GET",
                    success: function (data) {
                        var oValidateServ = myThis.getOwnerComponent().getModel("validateserv");
                        oValidateServ.setData(data);
                        sap.ui.getCore().setModel(oValidateServ);
                        if (data.Activ) {
                            myThis.byId('page').setVisible(true);
                            myThis.byId('pageMessage').setVisible(false);
                        } else {
                            myThis.byId('page').setVisible(false);
                            myThis.byId('pageMessage').setVisible(true);
                        }
                    },
                    error: function () {
                    }
                })
            },

            onValidateData: async function (myThis) {
                var oCalendar = this.byId("calendar");
                var oSelectedDates = oCalendar.getSelectedDates()[0];
                var begda = oSelectedDates.getStartDate().toJSON().slice(0, 10);
                var endda = oSelectedDates.getEndDate().toJSON().slice(0, 10);
                var oType = new sap.ui.model.type.DateTime;
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZHR_CO_FIORI_ESS_SRV/");
                oModel.setHeaders({
                    "X-Requested-With": "X"
                });
                var entryUrl = "/ZHRS_CO_UI_DEP_FUESet(Begda='" + begda + "',Endda='" + endda + "')";
                oModel.read(entryUrl, {
                    method: "GET",
                    success: function (data) {
                        if (data.Typem == 'E') {
                            MessageBox.error(data.Messa);
                        } else {
                            var begda = data.Begda.slice(0, 4) + data.Begda.slice(5, 7) + data.Begda.slice(8, 10);
                            var endda = data.Endda.slice(0, 4) + data.Endda.slice(5, 7) + data.Endda.slice(8, 10);
                            myThis.getOwnerComponent().getModel("entrydata").setProperty("/Begda", begda);
                            myThis.getOwnerComponent().getModel("entrydata").setProperty("/Endda", endda);
                            var oRouter = sap.ui.core.UIComponent.getRouterFor(myThis),
                                bReplace = true;
                            oRouter.navTo("pdfform", {}, bReplace);
                        }
                    },
                    error: function () {
                        var message = myThis.getView().getModel("i18n").getResourceBundle().getText("error");
                        MessageBox.error(message);
                    }
                })
            },

        });
    });
