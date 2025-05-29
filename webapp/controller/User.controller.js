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
    "sap/ui/layout/form/SimpleForm"
  ], function (BaseController, Title, Label, Input, Select, RadioButton, RadioButtonGroup, VBox, XMLView, SimpleForm) {
    "use strict";
  
    return BaseController.extend("sap.ui.demo.walkthrough.controller.User", {
        onInit: function () {
            // Retrieve forms from localStorage
            const storedForms = localStorage.getItem("forms");
            let forms = [];
          
            if (storedForms) {
              const parsed = JSON.parse(storedForms);
              forms = parsed.map(f => ({
                id: f.id,
                name: f.title,
                fullData: f
              }));
            }
          
            const oModel = new sap.ui.model.json.JSONModel({
              forms: forms
            });
          
            this.getView().setModel(oModel);
          },
  
      onFormSelectionChange: function (oEvent) {
        var sSelectedFormId = oEvent.getParameter("selectedItem").getKey();
        this._loadForm(sSelectedFormId);
      },
  
      _loadForm: function (formId) {
        const oFormContainer = this.byId("formDisplayVBox");
        oFormContainer.removeAllItems();
      
        const forms = this.getView().getModel().getProperty("/forms");
        const selectedForm = forms.find(f => f.id == formId);
      
        if (!selectedForm) return;
      
        const sections = selectedForm.fullData.sections;
      
        sections.forEach(section => {
          const grid = new sap.ui.layout.Grid({
            defaultSpan: "L4 M6 S12",
            hSpacing: 1,
            vSpacing: 1
          });
      
          section.questions.forEach(question => {
            const vbox = new sap.m.VBox();
            vbox.addItem(new sap.m.Label({ text: question.label }));
      
            let inputField;
            switch (question.type) {
              case "text":
                inputField = new sap.m.Input({ placeholder: question.label });
                break;
              case "email":
                inputField = new sap.m.Input({ type: "Email", placeholder: question.label });
                break;
              case "number":
                inputField = new sap.m.Input({ type: "Number", placeholder: question.label });
                break;
              case "dropdown":
                const select = new sap.m.Select();
                question.options.forEach(opt => {
                  select.addItem(new sap.ui.core.Item({ text: opt, key: opt }));
                });
                inputField = select;
                break;
              case "checkbox":
                const cbVBox = new sap.m.VBox();
                question.options.forEach(opt => {
                  cbVBox.addItem(new sap.m.CheckBox({ text: opt }));
                });
                inputField = cbVBox;
                break;
              case "radio":
                const radioVBox = new sap.m.VBox();
                const groupName = "radioGroup-" + Math.random().toString(36).substring(2, 7);
                question.options.forEach(opt => {
                  radioVBox.addItem(new sap.m.RadioButton({ text: opt, groupName }));
                });
                inputField = radioVBox;
                break;
              default:
                inputField = new sap.m.Input({ placeholder: question.label });
            }
      
            if (question.required && inputField.setRequired) {
              inputField.setRequired(true);
            }
      
            vbox.addItem(inputField);
            vbox.setLayoutData(new sap.ui.layout.GridData({ span: "L4 M6 S12" }));
            grid.addContent(vbox);
          });
      
          const panel = new sap.m.Panel({
            headerText: section.sectionTitle,
            content: [grid],
            class: "sapUiResponsiveMargin sectionPanelSpacing"
          });
      
          oFormContainer.addItem(panel);
        });
      }
      ,
      
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
  