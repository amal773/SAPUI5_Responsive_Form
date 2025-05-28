sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/demo/walkthrough/controller/handlers/SectionHandler",
  "sap/ui/demo/walkthrough/controller/handlers/ComponentHandler",
  "sap/ui/demo/walkthrough/controller/handlers/DialogHandler",
  "sap/ui/demo/walkthrough/controller/handlers/FieldRenderer"
], function (
  Controller, JSONModel, SectionHandler, ComponentHandler, DialogHandler, FieldRenderer
) {
  "use strict";

  return Controller.extend("sap.ui.demo.walkthrough.controller.App", {
    onInit: function () {
      const storedData = localStorage.getItem("formData");
      this.oModel = new JSONModel(storedData ? JSON.parse(storedData) : {
        sections: [],
        selectedSection: null
      });
      this.getView().setModel(this.oModel);
    },

    _saveToLocalStorage: function () {
      const data = this.oModel.getData();
      localStorage.setItem("formData", JSON.stringify(data));
    },

    onAddSection: function () {
      SectionHandler.addSection(this.getView(), this.oModel);
      this._saveToLocalStorage();
    },

    onSectionSelect: function (oEvent) {
      SectionHandler.selectSection(this.getView(), this.oModel, oEvent);
      this._saveToLocalStorage();
    },

    onAddComponent: function () {
      ComponentHandler.openComponentDialog(this.getView(), this.oModel, () => {
        this._saveToLocalStorage();
      });
    },

    _renderSectionFields: function () {
      SectionHandler.renderSectionFields(this.getView(), this.oModel, this._openConfigDialog.bind(this));
    },

    _openConfigDialog: function (field, index) {
      DialogHandler.openFieldConfigDialog(field, index, this.oModel, this._renderSectionFields.bind(this), this._saveToLocalStorage.bind(this));
    },
    onMenuPress: function () {
      // Add logic here for menu toggle
      sap.m.MessageToast.show("Menu button clicked");
    },

    onLogoutPress: function () {
      // Add logic here for logout
      sap.m.MessageToast.show("Logout button clicked");
    }
  });
});
