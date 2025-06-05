
sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/mvc/XMLView",
    "sap/ui/model/json/JSONModel",
    "sap/ui/demo/walkthrough/model/MockODataService"
  ],
  function (Controller, XMLView, JSONModel, MockODataService) {
    "use strict";
    const BASE_URL = "http://localhost:4004/odata/v4/catalog/Forms"

    return Controller.extend("sap.ui.demo.walkthrough.controller.Home", {
      onInit: function () {
        const that = this;
      
        if (!localStorage.getItem("forms")) {
          fetch(BASE_URL)
            .then(response => response.json())
            .then(data => {
              console.log(data.value[0].schema);
              localStorage.setItem("forms", data.value[0].schema);
              that._initializeModel();
            })
            .catch(err => console.error("Error fetching forms:", err));
        } else {
          this._initializeModel();
        }
      },

      _initializeModel: function () {
        const forms = MockODataService.getForms().map(f => ({
          id: String(f.id),
          title: f.title
        }));
      
        const oModel = new sap.ui.model.json.JSONModel({
          forms: forms,
          selectedForm: null
        });
      
        this.getView().setModel(oModel);
        sap.ui.getCore().setModel(oModel);
      },
      
      

      onCreateForm: function () {
        const oModel = this.getView().getModel();
        oModel.setProperty("/selectedForm", null); // Clear selected form
        oModel.setProperty("/isNewForm", true); // Set new form flag
        sap.ui.getCore().setModel(oModel); // Make it accessible globally

        this._navigateToAppView();
      },

      onEditForm: function () {
        const model = this.getView().getModel();
        const selectedFormId = model.getProperty("/selectedForm");

        const selectedForm = MockODataService.getFormById(selectedFormId);
        if (selectedForm) {
          model.setProperty("/selectedForm", selectedForm);
          model.setProperty("/isNewForm", false);
          sap.ui.getCore().setModel(model);
          this._navigateToAppView();
        } else {
          sap.m.MessageToast.show("Please select a valid form.");
        }
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
          viewName: "sap.ui.demo.walkthrough.view.App",
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
          viewName: "sap.ui.demo.walkthrough.view.Home",
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
          viewName: "sap.ui.demo.walkthrough.view.App",
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
          viewName: "sap.ui.demo.walkthrough.view.User",
        }).then(function (oAppView) {
          window.currentView = oAppView;
          oAppView.placeAt("content");
        });
      },
    });
  }
);
