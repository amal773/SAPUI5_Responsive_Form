sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/mvc/XMLView",
    "sap/ui/model/json/JSONModel"
  ], function (Controller, XMLView, JSONModel) {
    "use strict";
  
    return Controller.extend("sap.ui.demo.walkthrough.controller.Home", {
      onInit: function () {
        // Initialize a JSON model for selectedForm to control Edit button enablement
        let oModel = new JSONModel({
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
  