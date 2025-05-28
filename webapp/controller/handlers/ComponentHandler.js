sap.ui.define([
  "sap/m/SelectDialog",
  "sap/m/StandardListItem"
], function (SelectDialog, StandardListItem) {
  "use strict";

  return {
    openComponentDialog: function (view, model, onConfirmCallback) {
      const data = model.getData();
      if (!data.selectedSection) return;

      const oSelectDialog = new SelectDialog({
        title: "Select Component",
        items: [
          new StandardListItem({ title: "Text Field" }),
          new StandardListItem({ title: "Text Area" }),
          new StandardListItem({ title: "Number Field" }),
          new StandardListItem({ title: "Email Field" }),
          new StandardListItem({ title: "Date Picker" }),
          new StandardListItem({ title: "Checkbox" }),
          new StandardListItem({ title: "Dropdown" }),
          new StandardListItem({ title: "Radio Buttons" })
        ],
        confirm: function (oEvent) {
          const type = oEvent.getParameter("selectedItem").getTitle();
          data.selectedSection.fields.push({
            type,
            label: type,
            placeholder: "",
            required: false
          });
          model.updateBindings();
          const controller = view.getController();
          controller._renderSectionFields();
          onConfirmCallback && onConfirmCallback();
        }
      });

      oSelectDialog.open();
    }
  };
});
