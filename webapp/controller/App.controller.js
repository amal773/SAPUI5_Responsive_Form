sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/StandardListItem",
  "sap/m/Input",
  "sap/m/TextArea",
  "sap/m/CheckBox",
  "sap/m/RadioButton",
  "sap/m/RadioButtonGroup",
  "sap/m/Select",
  "sap/ui/core/Item",
  "sap/m/DatePicker",
  "sap/m/Button",
  "sap/m/Label",
  "sap/m/Dialog",
  "sap/m/SelectDialog",
  "sap/m/Text",
  "sap/ui/layout/Grid",

], function (
  Controller, JSONModel, StandardListItem, Input, TextArea, CheckBox,
  RadioButton, RadioButtonGroup, Select, Item, DatePicker, Button, Label,
  Dialog, SelectDialog, Text, Grid
) {
  "use strict";

  return Controller.extend("sap.ui.demo.walkthrough.controller.App", {
    onInit: function () {
      this.oModel = new JSONModel({
        sections: [],
        selectedSection: null
      });
      this.getView().setModel(this.oModel);
    },

    onAddSection: function () {
      const name = this.getView().byId("sectionNameInput").getValue().trim();
      if (!name) return;

      const data = this.oModel.getData();
      data.sections.push({ name, fields: [] });
      this.oModel.updateBindings();
      this.getView().byId("sectionNameInput").setValue("");
    },

    onSectionSelect: function (oEvent) {
      const selected = oEvent.getParameter("listItem").getTitle();
      const data = this.oModel.getData();
      const selectedSection = data.sections.find(sec => sec.name === selected);
      data.selectedSection = selectedSection;
      this.oModel.updateBindings();

      this._renderSectionFields();
    },

    onAddComponent: function () {
      const data = this.oModel.getData();
      if (!data.selectedSection) return;

      const oSelectDialog = new SelectDialog({
        title: "Select Component",
        items: [
          new sap.m.StandardListItem({ title: "Text Field" }),
          new sap.m.StandardListItem({ title: "Text Area" }),
          new sap.m.StandardListItem({ title: "Number Field" }),
          new sap.m.StandardListItem({ title: "Email Field" }),
          new sap.m.StandardListItem({ title: "Date Picker" }),
          new sap.m.StandardListItem({ title: "Checkbox" }),
          new sap.m.StandardListItem({ title: "Dropdown" }),
          new sap.m.StandardListItem({ title: "Radio Buttons" })
        ],
        confirm: function (oEvent) {
          const type = oEvent.getParameter("selectedItem").getTitle();
          data.selectedSection.fields.push({
            type,
            label: type,
            placeholder: "",
            required: false
          });
          this.oModel.updateBindings();
          this._renderSectionFields();
        }.bind(this)
      });

      oSelectDialog.open();
    },

    _renderSectionFields: function () {
      const oVBox = this.getView().byId("formArea");
      oVBox.removeAllItems();

      const fields = this.oModel.getProperty("/selectedSection/fields") || [];

      fields.forEach((field, index) => {
        const oControl = this._createComponentControl(field);
        const configButton = new Button({
          text: "Configure",
          press: this._openConfigDialog.bind(this, field, index)
        });

        oVBox.addItem(new sap.m.VBox({
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
    },

    _openConfigDialog: function (field, index) {
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
            this.oModel.updateBindings();
            this._renderSectionFields();
            dialog.close();
          }.bind(this)
        }),
        endButton: new Button({ text: "Cancel", press: () => dialog.close() })
      });

      dialog.open();
    }
  });
});
