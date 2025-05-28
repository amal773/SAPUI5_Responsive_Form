sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/VBox",
  "sap/m/HBox",
  "sap/m/Input",
  "sap/m/Label",
  "sap/m/Select",
  "sap/m/Button",
  "sap/m/Text",
  "sap/ui/core/Item",
  "sap/m/CheckBox",
  "sap/m/RadioButton",
  "sap/m/MessageToast",
  "sap/ui/layout/Grid",
  "sap/ui/layout/GridData"
], function (
  Controller, VBox, HBox, Input, Label, Select, Button, Text, Item, CheckBox, RadioButton, MessageToast, Grid, GridData
) {
  "use strict";

  return Controller.extend("sap.ui.demo.walkthrough.controller.App", {

    onInit: function () {
      this.sectionCount = 0;
      this.selectedSection = null;
      this._dialog = null;
      this.fieldType = null;
    },

    onAddSection: function () {
      // Create a grid for fields in this section
      const grid = new Grid({
        id: "grid-" + this.sectionCount,
        defaultSpan: "L4 M6 S12", // 3 columns on large screen, 2 on medium, 1 on small
        hSpacing: 1,
        vSpacing: 1
      });

      // Section container with header + select button + grid
      const section = new VBox({
        class: "sectionBox sapUiSmallMargin",
        items: [
          new HBox({
            justifyContent: "SpaceBetween",
            items: [
              new Text({ text: "Section " + (this.sectionCount + 1), class: "sectionHeader" }),
              new Button({
                text: "Select",
                press: () => {
                  this.selectedSection = grid;
                  // MessageToast.show("Selected Section " + (this.section));
                }
              })
            ]
          }),
          grid
        ]
      });

      this.byId("mainVBox").addItem(section);
      this.selectedSection = grid;  // auto-select new section
      this.sectionCount++;
    },

    _addFieldToGrid: function (oFieldVBox) {
      if (!this.selectedSection) {
        MessageToast.show("Please select a section first.");
        return;
      }

      // Wrap field in VBox with grid layout data (span 4 columns)
      const fieldBox = new VBox({
        layoutData: new GridData({ span: "L4 M6 S12" }),
        items: [oFieldVBox]
      });

      this.selectedSection.addContent(fieldBox);
    },

    onAddTextField: function () {
      this._openFieldConfigDialog("text");
    },

    onAddDropdown: function () {
      this._openFieldConfigDialog("dropdown");
    },

    onAddCheckbox: function () {
      this._openFieldConfigDialog("checkbox");
    },

    onAddRadioButton: function () {
      this._openFieldConfigDialog("radio");
    },

    onAddNumberField: function () {
      this._openFieldConfigDialog("number");
    },

    onAddEmailField: function () {
      this._openFieldConfigDialog("email");
    },

    _openFieldConfigDialog: function (fieldType) {
      this.fieldType = fieldType;

      this._getDialog().then(function (oDialog) {
        const oViewId = this.getView().getId();

        sap.ui.core.Fragment.byId(oViewId, "fieldLabelInput").setValue("");
        sap.ui.core.Fragment.byId(oViewId, "fieldPlaceholderInput")?.setValue("");
        sap.ui.core.Fragment.byId(oViewId, "fieldOptionsInput")?.setValue("");
        sap.ui.core.Fragment.byId(oViewId, "fieldCheckbox")?.setSelected(false);

        oDialog.setModel(new sap.ui.model.json.JSONModel({ fieldType: fieldType }));

        oDialog.open();
      }.bind(this));
    },

    _getDialog: function () {
      if (this._dialog) {
        return Promise.resolve(this._dialog);
      }

      return new Promise(function (resolve) {
        sap.ui.core.Fragment.load({
          id: this.getView().getId(),
          name: "sap.ui.demo.walkthrough.view.FieldConfigDialog",
          controller: this
        }).then(function (oDialog) {
          this._dialog = oDialog;
          this.getView().addDependent(oDialog);
          resolve(oDialog);
        }.bind(this));
      }.bind(this));
    },

    onDialogOk: function () {
      const oViewId = this.getView().getId();
      const label = sap.ui.core.Fragment.byId(oViewId, "fieldLabelInput").getValue();
      const placeholder = sap.ui.core.Fragment.byId(oViewId, "fieldPlaceholderInput")?.getValue() || "";
      const optionsRaw = sap.ui.core.Fragment.byId(oViewId, "fieldOptionsInput")?.getValue() || "";
      const checkedByDefault = sap.ui.core.Fragment.byId(oViewId, "fieldCheckbox")?.getSelected();

      if (!label && this.fieldType !== "checkbox") {
        MessageToast.show("Please enter a label.");
        return;
      }
      if (this.fieldType !== "text" && this.fieldType !== "number" && this.fieldType !== "email" && (this.fieldType === "dropdown" || this.fieldType === "radio" || this.fieldType === "checkbox") && optionsRaw.trim() === "") {
        MessageToast.show("Please enter options separated by commas.");
        return;
      }

      let fieldControl;

      switch (this.fieldType) {
        case "text":
          fieldControl = new Input({ placeholder });
          break;

        case "dropdown":
          const select = new Select();
          optionsRaw.split(",").map(opt => opt.trim()).filter(Boolean).forEach(opt => {
            select.addItem(new Item({ key: opt, text: opt }));
          });
          fieldControl = select;
          break;

        case "checkbox":
          // Create VBox with multiple checkboxes from options
          const cbVBox = new VBox();
          optionsRaw.split(",").map(opt => opt.trim()).filter(Boolean).forEach(opt => {
            cbVBox.addItem(new CheckBox({ text: opt, selected: false }));
          });
          fieldControl = cbVBox;
          break;

        case "radio":
          const radioGroupVBox = new VBox();
          optionsRaw.split(",").map(opt => opt.trim()).filter(Boolean).forEach(opt => {
            radioGroupVBox.addItem(new RadioButton({ text: opt, groupName: "radioGroup-" + Math.random().toString(36).substr(2, 5) }));
          });
          fieldControl = radioGroupVBox;
          break;

        case "number":
          fieldControl = new Input({
            type: "Number",
            placeholder
          });
          break;

        case "email":
          fieldControl = new Input({
            type: "Email",
            placeholder
          });
          break;

        default:
          MessageToast.show("Unsupported field type");
          return;
      }

      // For checkbox group and radio group, label above controls
      const fieldVBox = new VBox({
        items: [
          new Label({ text: label }),
          fieldControl
        ]
      });

      this._addFieldToGrid(fieldVBox);

      this._dialog.close();
    },

    onDialogCancel: function () {
      this._dialog.close();
    }

  });
});
