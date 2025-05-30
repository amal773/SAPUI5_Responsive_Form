sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/mvc/XMLView",
    "sap/ui/model/json/JSONModel"
  ], function (Controller, XMLView, JSONModel) {
    "use strict";
  
    return Controller.extend("sap.ui.demo.walkthrough.controller.Home", {
      onInit: function () {
        const storedForms = localStorage.getItem("forms");
        let forms = [];
      
        if (storedForms) {
          try {
            const parsed = JSON.parse(storedForms);
            forms = parsed.map(f => ({
              id: f.id,
              title: f.title
            }));
          } catch (e) {
            console.error("Error parsing stored forms", e);
          }
        }
      
        const oModel = new sap.ui.model.json.JSONModel({
          forms: forms,
          selectedForm: null
        });
      
        this.getView().setModel(oModel);
      },
      
      
  
      onCreateForm: function () {
        this._navigateToAppView();
      },
  
      onEditForm: function () {
        // You could pass the selected form info to App view here if needed
        this._navigateToAppView();
      },
  
      onFormSelectChange: function (oEvent) {
        let sSelectedKey = oEvent.getParameter("selectedItem").getKey();
        this.getView().getModel().setProperty("/selectedForm", sSelectedKey || null);
      },
  
      _navigateToAppView: function () {
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
  