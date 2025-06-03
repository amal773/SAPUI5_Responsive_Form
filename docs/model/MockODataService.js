
sap.ui.define([], function () {
    "use strict";
  
    return {
      getForms: function () {
        const stored = localStorage.getItem("forms");
        return stored ? JSON.parse(stored) : [];
      },
  
      getFormById: function (id) {
        const forms = this.getForms();
        return forms.find((f) => String(f.id) === String(id));
      },
  
      saveForm: function (form) {
        const forms = this.getForms();
        const index = forms.findIndex((f) => String(f.id) === String(form.id));
        if (index > -1) {
          forms[index] = form;
        } else {
          forms.push(form);
        }
        localStorage.setItem("forms", JSON.stringify(forms));
      },
  
      deleteForm: function (id) {
        let forms = this.getForms();
        forms = forms.filter((f) => String(f.id) !== String(id));
        localStorage.setItem("forms", JSON.stringify(forms));
      }
    };
  });
  