sap.ui.define([
  "sap/m/StandardListItem",
  "sap/m/SelectDialog",
  "sap/m/VBox",
  "sap/m/Button",
  "sap/m/Input",
  "sap/m/TextArea",
  "sap/m/CheckBox",
  "sap/m/RadioButton",
  "sap/m/RadioButtonGroup",
  "sap/m/Select",
  "sap/ui/core/Item",
  "sap/m/DatePicker",
  "sap/m/Label",
  "sap/m/Text"
], function (
  StandardListItem, SelectDialog, VBox, Button, Input, TextArea,
  CheckBox, RadioButton, RadioButtonGroup, Select, Item,
  DatePicker, Label, Text
) {
  "use strict";

  return {
    addComponentDialog: function (controller) {
      const data = controller.oModel.getData();
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
          controller.oModel.updateBindings();
          controller._renderSectionFields();
        }
      });

      oSelectDialog.open();
    },

    renderSectionFields: function (controller) {
      const oVBox = controller.getView().byId("formArea");
      oVBox.removeAllItems();

      const fields = controller.oModel.getProperty("/selectedSection/fields") || [];

      fields.forEach((field, index) => {
        const oControl = this._createComponentControl(field);
        const configButton = new Button({
          text: "Configure",
          press: controller._openConfigDialog.bind(controller, field, index)
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
    },

    _createComponentControl: function (field) {
      const props = {
        placeholder: field.placeholder || "",
        required: !!field.required
      };

      switch (field.type) {
        case "Text Field": return new Input(props);
        case "Text Area": return new TextArea(props);
        case "Number Field": return new Input({ ...props, type: "Number" });
        case "Email Field": return new Input({ ...props, type: "Email" });
        case "Date Picker": return new DatePicker();
        case "Checkbox": return new CheckBox({ text: field.label });
        case "Dropdown":
          return new Select({
            items: [
              new Item({ text: "Option 1" }),
              new Item({ text: "Option 2" })
            ]
          });
        case "Radio Buttons":
          return new RadioButtonGroup({
            columns: 2,
            buttons: [
              new RadioButton({ text: "Yes" }),
              new RadioButton({ text: "No" })
            ]
          });
        default:
          return new Text({ text: "Unsupported field" });
      }
    }
  };
});
