sap.ui.define([], function () {
  "use strict";

  return {
    addSection: function (controller) {
      const name = controller.getView().byId("sectionNameInput").getValue().trim();
      if (!name) return;

      const data = controller.oModel.getData();
      data.sections.push({ name, fields: [] });
      controller.oModel.updateBindings();
      controller.getView().byId("sectionNameInput").setValue("");
    },

    selectSection: function (controller, oEvent) {
      const selected = oEvent.getParameter("listItem").getTitle();
      const data = controller.oModel.getData();
      data.selectedSection = data.sections.find(sec => sec.name === selected);
      controller.oModel.updateBindings();
      controller._renderSectionFields();
    }
  };
});
