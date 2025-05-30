sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/mvc/XMLView",
    "sap/ui/model/json/JSONModel",
  ],
  function (Controller, XMLView, JSONModel) {
    "use strict";

    return Controller.extend("sap.ui.demo.walkthrough.controller.Home", {
      onInit: function () {
        localStorage.setItem(
          "forms",
          '[{},{"id":9999,"title":"Contractor Performance","sections":[{"id":"sec1","sectionTitle":"General Information","questions":[{"id":"q1","label":"Job Task - Select primary job type from dropdown menu","type":"dropdown","options":["Excavation","Welding","Electrical","Inspection","Other"],"required":true},{"id":"q2","label":"Contractor Rep – Name of contractor representative","type":"text","required":true},{"id":"q3","label":"Company - Select contractor being reviewed","type":"dropdown","options":["ABC Ltd.","XYZ Corp.","Delta Services","Other"],"required":true},{"id":"q4","label":"Date – Observation or form completion date","type":"date","required":true},{"id":"q5","label":"Start Time","type":"time","required":true},{"id":"q6","label":"End Time","type":"time","required":true},{"id":"q7","label":"High Pressure – Select Yes or No","type":"radio","options":["Yes","No"],"required":true},{"id":"q8","label":"Work Order Number","type":"text","required":true},{"id":"q9","label":"Crew Size","type":"number","required":true}]},{"id":"sec2","sectionTitle":"Performance Observations","questions":[{"id":"q10","label":"Were work permits followed correctly?","type":"radio","options":["Yes","No","N/A"],"required":true},{"id":"q11","label":"Was PPE worn appropriately?","type":"radio","options":["Yes","No","N/A"],"required":true},{"id":"q12","label":"Tools and equipment in good condition?","type":"radio","options":["Yes","No","N/A"],"required":true},{"id":"q13","label":"Was the work area kept clean?","type":"radio","options":["Yes","No","N/A"],"required":true},{"id":"q14","label":"Was job site communication effective?","type":"radio","options":["Yes","No","N/A"],"required":true},{"id":"q15","label":"Was job completed safely?","type":"radio","options":["Yes","No","N/A"],"required":true},{"id":"q16","label":"Any hazards identified?","type":"radio","options":["Yes","No","N/A"],"required":true},{"id":"q17","label":"Additional safety observations","type":"textarea","required":false}]},{"id":"sec3","sectionTitle":"Comments and Signatures","questions":[{"id":"q18","label":"Evaluator Comments","type":"textarea","required":false},{"id":"q19","label":"Follow-up Required?","type":"radio","options":["Yes","No"],"required":true},{"id":"q20","label":"Signature of Evaluator","type":"text","required":true},{"id":"q21","label":"Date of Evaluation","type":"date","required":true}]}]}]'
        );
        const storedForms = localStorage.getItem("forms");
        let forms = [];

        if (storedForms) {
          try {
            const parsed = JSON.parse(storedForms);
            forms = parsed.map((f) => ({
              id: f.id,
              title: f.title,
            }));
          } catch (e) {
            console.error("Error parsing stored forms", e);
          }
        }

        const oModel = new sap.ui.model.json.JSONModel({
          forms: forms,
          selectedForm: null,
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

      onEditForm: function (oEvent) {
       
const selectedForm = this.getView().getModel().getProperty("/selectedForm");
  if (selectedForm) {
    this._navigateToAppView();
  } else {
    sap.m.MessageToast.show("Please select a form to edit.");
  }

      },

      onFormSelectChange: function (oEvent) {
        let sSelectedKey = oEvent.getParameter("selectedItem").getKey();
        this.getView()
          .getModel()
          .setProperty("/selectedForm", sSelectedKey || null);
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
