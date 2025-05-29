sap.ui.define([
    "sap/ui/core/mvc/XMLView"
  ], function (XMLView) {
    "use strict";

    XMLView.create({
      viewName: "sap.ui.demo.walkthrough.view.Home"
    }).then(function (oView) {
      window.currentView = oView;  // store reference globally
      oView.placeAt("content");
    });
  });
  