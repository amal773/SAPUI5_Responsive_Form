sap.ui.define(
  [
    "sap/ui/core/mvc/Controller", // relative path from the controller folder
    "sap/m/Title",
    "sap/m/Label",
    "sap/m/Input",
    "sap/m/Select",
    "sap/m/RadioButton",
    "sap/m/RadioButtonGroup",
    "sap/m/VBox",
    "sap/ui/core/mvc/XMLView",
    "sap/ui/layout/form/SimpleForm",
  ],
  function (
    BaseController,
    Title,
    Label,
    Input,
    Select,
    RadioButton,
    RadioButtonGroup,
    VBox,
    XMLView,
    SimpleForm
  ) {
    "use strict";

    return BaseController.extend("sap.ui.demo.walkthrough.controller.User", {
      onInit: function () {
        // Retrieve forms from localStorage
        const storedForms = localStorage.getItem("forms");
        let forms = [];

        if (storedForms) {
          const parsed = JSON.parse(storedForms);
          forms = parsed.map((f) => ({
            id: f.id,
            name: f.title,
            fullData: f,
          }));
        }

        const oModel = new sap.ui.model.json.JSONModel({
          forms: forms,
        });

        this.getView().setModel(oModel);
        this.getView().setModel(
          new sap.ui.model.json.JSONModel({ reasons: {} }),
          "reasons"
        );
      },

      onFormSelectionChange: function (oEvent) {
        var sSelectedFormId = oEvent.getParameter("selectedItem").getKey();
        this._loadForm(sSelectedFormId);
      },

      _loadForm: function (formId) {
        const oFormContainer = this.byId("formDisplayVBox");
        oFormContainer.removeAllItems();

        const forms = this.getView().getModel().getProperty("/forms");
        const selectedForm = forms.find((f) => f.id == formId);
        if (!selectedForm) return;

        const sections = selectedForm.fullData.sections;

        // Load saved reasons from localStorage into the model
        const savedReasons = JSON.parse(
          localStorage.getItem("radioReasons") || "{}"
        );
        this.getView().getModel("reasons").setData(savedReasons);

        sections.forEach((section) => {
          const grid = new sap.ui.layout.Grid({
            defaultSpan: "L4 M6 S12",
            hSpacing: 1,
            vSpacing: 1,
          });

          section.questions.forEach((question) => {
            const vbox = new sap.m.VBox();
            vbox.addItem(new sap.m.Label({ text: question.label }));

            let inputField;
            switch (question.type) {
              case "text":
                inputField = new sap.m.Input({ placeholder: question.label });
                break;
              case "email":
                inputField = new sap.m.Input({
                  type: "Email",
                  placeholder: question.label,
                });
                break;
              case "number":
                inputField = new sap.m.Input({
                  type: "Number",
                  placeholder: question.label,
                });
                break;
              case "dropdown":
                const select = new sap.m.Select();
                question.options.forEach((opt) => {
                  select.addItem(new sap.ui.core.Item({ text: opt, key: opt }));
                });
                inputField = select;
                break;
              case "checkbox":
                const cbVBox = new sap.m.VBox();
                question.options.forEach((opt) => {
                  cbVBox.addItem(new sap.m.CheckBox({ text: opt }));
                });
                inputField = cbVBox;
                break;
              case "radio":
                const radioVBox = new sap.m.VBox();
                const groupName =
                  "radioGroup-" + Math.random().toString(36).substring(2, 7);
                question.options.forEach((opt) => {
                  const reasonKey = `${formId}-${question.id}-${opt}`;
                  const radio = new sap.m.RadioButton({
                    text: opt,
                    groupName: groupName,
                    select: function () {
                      const radioButton = this;
                      const dialog = new sap.m.Dialog({
                        title: "📝 Reason for Selection",
                        type: "Message",
                        contentWidth: "400px",
                        content: [
                          new sap.m.VBox({
                            width: "100%",
                            alignItems: "Start",
                            items: [
                              new sap.m.Text({
                                text: `Why did you select "${opt}"?`,
                                wrapping: true,
                                class: "sapUiSmallMarginBottom",
                              }),
                              new sap.m.TextArea("reasonInput", {
                                rows: 5,
                                width: "100%",
                                placeholder: "Please provide your comments...",
                                growing: true,
                                growingMaxLines: 6,
                                class: "sapUiTinyMarginBottom",
                              }),
                            ],
                          }),
                        ],
                        beginButton: new sap.m.Button({
                          text: "Submit",
                          type: "Emphasized",
                          icon: "sap-icon://accept",
                          press: function () {
                            const reason = sap.ui
                              .getCore()
                              .byId("reasonInput")
                              .getValue();
                            dialog.close();

                            // Save to localStorage
                            const allReasons = JSON.parse(
                              localStorage.getItem("radioReasons") || "{}"
                            );
                            allReasons[reasonKey] = reason;
                            localStorage.setItem(
                              "radioReasons",
                              JSON.stringify(allReasons)
                            );

                            // Update model to reflect immediately
                            const reasonModel = radioButton.getModel("reasons");
                            const updatedData = reasonModel.getData();
                            updatedData[reasonKey] = reason;
                            reasonModel.setData(updatedData);
                          },
                        }),
                        endButton: new sap.m.Button({
                          text: "Cancel",
                          type: "Reject",
                          icon: "sap-icon://decline",
                          press: function () {
                            dialog.close();
                          },
                        }),
                        afterClose: function () {
                          dialog.destroy();
                        },
                      });
                      dialog.open();
                    },
                  });
                  radioVBox.addItem(radio);

                  // Bind reason text to the model

                  const reasonText = new sap.m.Text({
                    text: {
                      path: `reasons>/${reasonKey}`,
                      formatter: function (val) {
                        return val ? `🗒️ Comments: ${val}` : "";
                      }
                    },
                    wrapping: true,
                    class: "styledReasonText"
                  }).data("reasonFor", reasonKey);
                  

                  radioVBox.addItem(reasonText);
                });
                inputField = radioVBox;
                break;
              case "textarea":
                inputField = new sap.m.TextArea({
                  placeholder: question.label,
                  rows: 4,
                });
                break;
              case "date":
                inputField = new sap.m.DatePicker({
                  placeholder: question.label,
                });
                break;
              case "time":
                inputField = new sap.m.TimePicker({
                  placeholder: question.label,
                });
                break;
              default:
                inputField = new sap.m.Input({ placeholder: question.label });
            }

            if (question.required && inputField.setRequired) {
              inputField.setRequired(true);
            }

            vbox.addItem(inputField);
            vbox.setLayoutData(
              new sap.ui.layout.GridData({ span: "L4 M6 S12" })
            );
            grid.addContent(vbox);
          });

          const panel = new sap.m.Panel({
            headerText: section.sectionTitle,
            content: [grid],
            class: "sapUiResponsiveMargin sectionPanelSpacing",
          });

          oFormContainer.addItem(panel);
        });
      },

      navigateHome: function () {
        if (window.currentView) {
          window.currentView.destroy();
        }

        XMLView.create({
          viewName: "sap.ui.demo.walkthrough.view.Home",
        }).then(function (oAppView) {
          window.currentView = oAppView;
          oAppView.placeAt("content");
        });
      },

      navigateForm: function () {
        if (window.currentView) {
          window.currentView.destroy();
        }

        XMLView.create({
          viewName: "sap.ui.demo.walkthrough.view.App",
        }).then(function (oAppView) {
          window.currentView = oAppView;
          oAppView.placeAt("content");
        });
      },

      navigateUser: function () {
        if (window.currentView) {
          window.currentView.destroy();
        }

        XMLView.create({
          viewName: "sap.ui.demo.walkthrough.view.User",
        }).then(function (oAppView) {
          window.currentView = oAppView;
          oAppView.placeAt("content");
        });
      },
      onSubmitForm: function () {
        this.onClearForm();
        sap.m.MessageToast.show("Form submitted successfully!", {
          duration: 3000,
          width: "20em",
        });
      },

      onClearForm: function () {
        const oFormContainer = this.byId("formDisplayVBox");
        const clearInputs = function (oControl) {
          if (oControl instanceof sap.m.Input) {
            oControl.setValue("");
          } else if (oControl instanceof sap.m.Select) {
            oControl.setSelectedKey("");
          } else if (oControl instanceof sap.m.CheckBox) {
            oControl.setSelected(false);
          } else if (oControl instanceof sap.m.RadioButton) {
            oControl.setSelected(false);
          } else if (
            oControl instanceof sap.ui.core.Control &&
            oControl.getItems
          ) {
            oControl.getItems().forEach(clearInputs);
          } else if (oControl instanceof sap.m.TextArea) {
            oControl.setValue("");
          } else if (oControl instanceof sap.m.DatePicker) {
            oControl.setDateValue(null);
          } else if (oControl instanceof sap.m.TimePicker) {
            oControl.setDateValue(null);
          } else if (
            oControl instanceof sap.ui.core.Control &&
            oControl.getContent
          ) {
            oControl.getContent().forEach(clearInputs);
          } else if (
            oControl instanceof sap.ui.core.Control &&
            oControl.getAggregation
          ) {
            const aggs =
              oControl.getAggregation("items") ||
              oControl.getAggregation("content") ||
              [];
            aggs.forEach(clearInputs);
          }
        };

        oFormContainer.getItems().forEach((panel) => {
          panel.getContent().forEach((grid) => {
            if (grid instanceof sap.ui.layout.Grid) {
              grid.getContent().forEach((vbox) => {
                vbox.getItems().forEach(clearInputs);
              });
            }
          });
        });
      },
    });
  }
);
