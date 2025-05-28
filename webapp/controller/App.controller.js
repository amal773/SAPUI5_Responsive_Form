sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "./handlers/SectionHandler",
  "./handlers/ComponentHandler",
  "./handlers/DialogHandler"
], function (Controller, JSONModel, SectionHandler, ComponentHandler, DialogHandler) {
  "use strict";

  return Controller.extend("sap.ui.demo.walkthrough.controller.App", {
    onInit: function () {
      this.oModel = new JSONModel({
        sections: [],
        selectedSection: null
      });
      this.getView().setModel(this.oModel);
    },

    onAddSection: function () {
      SectionHandler.addSection(this);
    },

    onSectionSelect: function (oEvent) {
      SectionHandler.selectSection(this, oEvent);
    },

    onAddComponent: function () {
      ComponentHandler.addComponentDialog(this);
    },

    _renderSectionFields: function () {
      ComponentHandler.renderSectionFields(this);
    },

    _openConfigDialog: function (field, index) {
      DialogHandler.openFieldConfigDialog(this, field, index);
    }
  });
});
