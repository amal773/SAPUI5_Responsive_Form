sap.ui.define([
  "sap/m/Label",
  "sap/m/Button",
  "sap/m/VBox",
  "sap/ui/demo/walkthrough/controller/handlers/FieldRenderer"
], function (Label, Button, VBox, FieldRenderer) {
  "use strict";

  return {
    addSection: function (view, model) {
      const name = view.byId("sectionNameInput").getValue().trim();
      if (!name) return;

      const data = model.getData();
      data.sections.push({ name, fields: [] });
      model.updateBindings();
      view.byId("sectionNameInput").setValue("");
    },

    selectSection: function (view, model, event) {
      const selected = event.getParameter("listItem").getTitle();
      const data = model.getData();
      const selectedSection = data.sections.find(sec => sec.name === selected);
      data.selectedSection = selectedSection;
      model.updateBindings();

      const controller = view.getController();
      controller._renderSectionFields();
    },

    renderSectionFields: function (view, model, openConfigCallback) {
      const oVBox = view.byId("formArea");
      oVBox.removeAllItems();

      const fields = model.getProperty("/selectedSection/fields") || [];

      fields.forEach((field, index) => {
        const oControl = FieldRenderer.createControl(field);
        const configButton = new Button({
          text: "Configure",
          press: openConfigCallback.bind(null, field, index)
        });

        oVBox.addItem(new VBox({
          items: [
            new Label({ text: field.label }),
            oControl,
            configButton
          ],
          class: "sapUiSmallMarginBottom"
        }));
      });
    }
  };
});
