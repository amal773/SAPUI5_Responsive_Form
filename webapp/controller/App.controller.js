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
      this.currentFormId = null;
      this.currentFormId = Date.now();
      this.fieldType = null;
    },

    onAddSection: function () {
      const grid = new Grid({
        id: "grid-" + this.sectionCount,
        defaultSpan: "L4 M6 S12",
        hSpacing: 1,
        vSpacing: 1
      });
    
      const headerText = "Section " + (this.sectionCount + 1);
    
      const panel = new sap.m.Panel({
        headerToolbar: new sap.m.Toolbar({
          content: [
            new sap.m.Text({ text: headerText }),
            new sap.m.ToolbarSpacer(),
            new Button({
              text: "Select",
              press: () => {
                this._clearSelectedSections();
                panel.addStyleClass("selectedSectionCard");
                this.selectedSection = grid;
                MessageToast.show("Selected " + headerText);
              }
            })
          ]
        }),
        content: [grid],
        expandable: false,
        class: "sapUiResponsiveMargin sapUiTinyMarginBottom sapUiTinyMarginTop sapUiMediumPadding"
      });
    
      this.byId("mainVBox").addItem(panel);
      this.selectedSection = grid;
      this._clearSelectedSections();
      panel.addStyleClass("selectedSectionCard");
      this.sectionCount++;

      // Save to localStorage after adding a section
      this.saveFormToLocalStorage();
    },

    _clearSelectedSections: function () {
      const mainVBox = this.byId("mainVBox");
      if (!mainVBox) return;
      mainVBox.getItems().forEach(item => {
        if (item.removeStyleClass) {
          item.removeStyleClass("selectedSectionCard");
        }
      });
    },

    _addFieldToGrid: function (oFieldVBox) {
      if (!this.selectedSection) {
        MessageToast.show("Please select a section first.");
        return;
      }

      const fieldBox = new VBox({
        layoutData: new GridData({ span: "L4 M6 S12" }),
        items: [oFieldVBox]
      });

      this.selectedSection.addContent(fieldBox);

      // Save to localStorage after adding a field
      this.saveFormToLocalStorage();
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

    saveFormToLocalStorage: function () {
      const newForm = this._generateFormObject();
    
      const existing = localStorage.getItem("forms");
      let forms = existing ? JSON.parse(existing) : [];
    
      // Check if form with current ID already exists
      const existingIndex = forms.findIndex(f => f.id === newForm.id);
    
      if (existingIndex > -1) {
        forms[existingIndex] = newForm; // Overwrite existing
      } else {
        forms.push(newForm); // First-time save
      }
    
      localStorage.setItem("forms", JSON.stringify(forms));
      MessageToast.show("Form saved to localStorage.");
    },
    

    _generateFormObject: function () {
      const mainVBox = this.byId("mainVBox");
      const sections = [];
      let sectionIndex = 1;
      let questionCounter = 1;
    
      mainVBox.getItems().forEach(item => {
        if (item.isA("sap.m.Panel")) {
          const sectionId = `sec${sectionIndex++}`;
          const grid = item.getContent()[0];
          const questions = [];
    
          grid.getContent().forEach(vboxWrapper => {
            const vbox = vboxWrapper.getItems()[0];
            const label = vbox.getItems()[0].getText();
            const field = vbox.getItems()[1];
    
            let question = {
              id: `q${questionCounter++}`,
              label: label,
              required: true
            };
    
            if (field.isA("sap.m.Input")) {
              const type = field.getType ? field.getType() : "Text";
              question.type = type.toLowerCase() === "email" ? "email" : type.toLowerCase();
            } else if (field.isA("sap.m.Select")) {
              question.type = "dropdown";
              question.options = field.getItems().map(i => i.getText());
            } else if (field.isA("sap.m.VBox")) {
              const items = field.getItems();
              if (items.length && items[0].isA("sap.m.CheckBox")) {
                question.type = "checkbox";
                question.options = items.map(i => i.getText());
              } else if (items.length && items[0].isA("sap.m.RadioButton")) {
                question.type = "radio";
                question.options = items.map(i => i.getText());
              }
            }
    
            questions.push(question);
          });
    
          sections.push({
            id: sectionId,
            sectionTitle: item.getHeaderToolbar().getContent()[0].getText(),
            questions: questions
          });
        }
      });
    
      return {
        id: this.currentFormId,
        title: this.byId("formTitleInput").getValue().trim() || "Untitled Form",
        sections: sections
      };
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

      if ((this.fieldType === "dropdown" || this.fieldType === "radio" || this.fieldType === "checkbox") && optionsRaw.trim() === "") {
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
          fieldControl = new Input({ type: "Number", placeholder });
          break;
        case "email":
          fieldControl = new Input({ type: "Email", placeholder });
          break;
        default:
          MessageToast.show("Unsupported field type");
          return;
      }

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
    },

    onCreateForm: function () {
      this.saveFormToLocalStorage();
      this._navigateToAppView();
    }

  });
});
