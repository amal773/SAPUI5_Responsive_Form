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
          // Add section title
          oFormContainer.addItem(new sap.m.Title({ text: section.sectionTitle, level: "H4" }));
      
          // Use SimpleForm for grid layout
          const oSimpleForm = new sap.ui.layout.form.SimpleForm({
            layout: "ResponsiveGridLayout",
            columnsL: 2,
            columnsM: 1
          });
      
          section.questions.forEach(question => {
            oSimpleForm.addContent(new sap.m.Label({ text: question.label }));
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
                inputField = new sap.m.Select({
                    width: "100%",         // fills container width, but container is limited
                    maxWidth: "250px",     // max width so it doesn't expand too much
                    popupWidth: "300px",
                    items: [
                      new sap.ui.core.Item({ key: "1", text: "Option 1" }),
                      new sap.ui.core.Item({ key: "2", text: "Option 2" })
                    ]
                  });
                  
                break;
              default:
                inputField = new sap.m.Input({ placeholder: question.label });
            }
      
            if (question.required) {
              inputField.setRequired(true);
            }
      
            oSimpleForm.addContent(inputField);
          });
      
          oFormContainer.addItem(oSimpleForm);
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
  