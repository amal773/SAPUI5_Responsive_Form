sap.ui.define([
  "sap/m/Dialog",
  "sap/m/Label",
  "sap/m/Input",
  "sap/m/CheckBox",
  "sap/m/Button"
], function (Dialog, Label, Input, CheckBox, Button) {
  "use strict";

  return {
    openFieldConfigDialog: function (controller, field, index) {
      const dialog = new Dialog({
        title: "Configure Field",
        content: [
          new Label({ text: "Label" }),
          new Input({ value: field.label }),
          new Label({ text: "Placeholder" }),
          new Input({ value: field.placeholder }),
          new CheckBox({ text: "Mandatory", selected: field.required })
        ],
        beginButton: new Button({
          text: "OK",
          press: function () {
            field.label = dialog.getContent()[1].getValue();
            field.placeholder = dialog.getContent()[3].getValue();
            field.required = dialog.getContent()[4].getSelected();
            controller.oModel.updateBindings();
            controller._renderSectionFields();
            dialog.close();
          }
        }),
        endButton: new Button({
          text: "Cancel",
          press: () => dialog.close()
        })
      });

      dialog.open();
    }
  };
});
