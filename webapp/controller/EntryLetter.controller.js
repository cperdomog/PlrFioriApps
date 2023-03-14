sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     */
    function (Controller,JSONModel) {
        "use strict";

        return Controller.extend("polar.zui5letter.controller.EntryLetter", {
            onInit: function () {
                var oViewModel = new JSONModel();
                this.getView().setModel(oViewModel, "entryletterView");
                sap.ui.core.UIComponent.getRouterFor(this).getRoute("entryletter").attachPatternMatched(this.onObjectMatched, this);
            },
            onObjectMatched: function (oEvent) {
                
            },
            onGetPdf: function(){
                var oRBGroup = this.getView().byId("rbg1");
                var selectedIndex = oRBGroup.getSelectedIndex();
                var optionLetter;
                switch (selectedIndex) {
                    case 0:
                        optionLetter = '01';
                        break;
                    case 1:
                        optionLetter = '02';
                        break;
                    case 2:
                        optionLetter = '03';
                        break;
                    case 3:
                        optionLetter = '04';
                        break;
                    case 4:
                        optionLetter = '05';
                        break;
                  }
                this.getOwnerComponent().getModel("entryletter").setProperty("/OptLetter", optionLetter);
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this),
                bReplace = true;
              oRouter.navTo("pdfletter", {}, bReplace);
            }

        });
    });
