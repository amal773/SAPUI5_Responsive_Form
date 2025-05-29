sap.ui.define([
    "sap/ui/core/mvc/Controller",  // relative path from the controller folder
    "sap/m/Title",
    "sap/m/Label",
    "sap/m/Input",
    "sap/m/Select",
    "sap/m/RadioButton",
    "sap/m/RadioButtonGroup",
    "sap/m/VBox",
    "sap/ui/core/mvc/XMLView",
  ], function (BaseController, Title, Label, Input, Select, RadioButton, RadioButtonGroup, VBox, XMLView) {
    "use strict";
  
    return BaseController.extend("sap.ui.demo.walkthrough.controller.User", {
      onInit: function () {
        var oModel = new sap.ui.model.json.JSONModel({
          forms: [
            { id: "form1", name: "Employee Info" },
            { id: "form2", name: "Contact Form" }
          ]
        });
        this.getView().setModel(oModel);
      },
  
      onFormSelectionChange: function (oEvent) {
        var sSelectedFormId = oEvent.getParameter("selectedItem").getKey();
        this._loadForm(sSelectedFormId);
      },
  
      _loadForm: function (formId) {
        var oFormContainer = this.byId("formDisplayVBox");
        oFormContainer.removeAllItems();
  
        var formDefinitions = {
          form1: [
            { type: "Title", text: "Employee Details" },
            { type: "TextField", label: "Name" },
            { type: "NumberField", label: "Age" },
            { type: "EmailField", label: "Email" }
          ],
          form2: [
            { type: "Title", text: "Contact Us" },
            { type: "TextField", label: "Full Name" },
            { type: "TextField", label: "Subject" },
            { type: "EmailField", label: "Email" }
          ]
        };
  
        var fields = formDefinitions[formId];
        fields.forEach(field => {
          switch (field.type) {
            case "Title":
              oFormContainer.addItem(new Title({ text: field.text, level: "H3" }));
              break;
            case "TextField":
              oFormContainer.addItem(new Label({ text: field.label }));
              oFormContainer.addItem(new Input({ placeholder: field.label }));
              break;
            case "NumberField":
              oFormContainer.addItem(new Label({ text: field.label }));
              oFormContainer.addItem(new Input({ type: "Number", placeholder: field.label }));
              break;
            case "EmailField":
              oFormContainer.addItem(new Label({ text: field.label }));
              oFormContainer.addItem(new Input({ type: "Email", placeholder: field.label }));
              break;
          }
        });
      },
      navigateHome: function () {
        if (window.currentView) {
          window.currentView.destroy();
        }
  
        XMLView.create({
          viewName: "sap.ui.demo.walkthrough.view.Home"
        }).then(function (oAppView) {
          window.currentView = oAppView;
          oAppView.placeAt("content");
        });
      },

      navigateForm: function () {
        if (window.currentView) {
          window.currentView.destroy();
        }
  
        XMLView.create({
          viewName: "sap.ui.demo.walkthrough.view.App"
        }).then(function (oAppView) {
          window.currentView = oAppView;
          oAppView.placeAt("content");
        });
      },

      navigateUser: function () {
        if (window.currentView) {
          window.currentView.destroy();
        }
  
        XMLView.create({
          viewName: "sap.ui.demo.walkthrough.view.User"
        }).then(function (oAppView) {
          window.currentView = oAppView;
          oAppView.placeAt("content");
        });
      }
    });
  });
  