sap.ui.define([
  "sap/m/Input",
  "sap/m/TextArea",
  "sap/m/CheckBox",
  "sap/m/RadioButton",
  "sap/m/RadioButtonGroup",
  "sap/m/Select",
  "sap/ui/core/Item",
  "sap/m/DatePicker",
  "sap/m/Text"
], function (
  Input, TextArea, CheckBox, RadioButton, RadioButtonGroup, Select, Item, DatePicker, Text
) {
  "use strict";

  return {
    createControl: function (field) {
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
