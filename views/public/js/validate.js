function Validator(form) {
  var formRules = {};
  var Rules = {
    isRequired: (value) => {
      return value ? undefined : "Please input here";
    },

    isEmail: (value) => {
      var email_confirm = /^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/;
      return email_confirm.test(value) ? undefined : "Email is wrong";
    },
    isPhone: (value) => {
      var phone_confirm = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      return phone_confirm.test(value) ? undefined : "Invalid phone number";
    },

    min: (min) => {
      return (value) => {
        return value.length >= min ? undefined : min + " character please";
      };
    },
    isValidDate: (value) => {
      value = new Date(value);
      return value > Date.now() ? undefined : "Invalid Date";
    },

    isConfirm: (confirmValue) => {
      var confirm = document.getElementById(confirmValue);

      return (value) => {
        return value === confirm.value ? undefined : "wrong !!!";
      };
    },
  };
  var formElement = document.querySelector(form);
  if (formElement) {
    var inputElements = formElement.querySelectorAll("[rules]");
    // Array.from(inputElements).reduce((rule, input) => {
    //   rule[input.name] = input.getAttribute("rules");
    //   return rule;
    // }, formRules);
    for (var input of inputElements) {
      var rules = input.getAttribute("rules").split("|");
      for (var rule of rules) {
        var ruleFunc;
        if (rule.includes(":")) {
          var ruleDetail = rule.split(":");
          rule = ruleDetail[0];
          ruleFunc = Rules[rule](ruleDetail[1]);
        } else ruleFunc = Rules[rule];
        if (Array.isArray(formRules[input.name])) {
          formRules[input.name].push(ruleFunc);
        } else {
          formRules[input.name] = [ruleFunc];
        }
        input.onblur = validate;
      }
    }
  }

  function getParent(input, parent) {
    while (input.parentElement) {
      if (input.parentElement.matches(parent)) {
        //console.log()
        return input.parentElement;
      }
      input = input.parentElement;
    }
  }

  function validate(event) {
    var input = event.target;

    var rules = formRules[input.name];
    var errorMessage;
    for (var rule of rules) {
      errorMessage = rule(input.value);
      if (errorMessage) break;
    }

    var formGroup = getParent(input, ".form-group");
    if (formGroup) {
      var errorElement = formGroup.querySelector(".error-control");
      if (errorElement) {
        if (errorMessage) {
          errorElement.innerHTML = `<i class="fa fa-exclamation-triangle" aria-hidden="true"></i> ${errorMessage}`;
          formGroup.classList.add("invalid");
        } else {
          errorElement.innerHTML = "";
          formGroup.classList.remove("invalid");
        }
      }
      input.oninput = function () {
        errorElement.innerHTML = "";
        formGroup.classList.remove("invalid");
      };
    }
    return errorMessage;
  }
  formElement.onsubmit = function (event) {
    event.preventDefault();
    var checkAll = true;
    for (var input of inputElements) {
      if (validate({ target: input })) {
        checkAll = false;
      }
    }
    if (checkAll) {
      var formData = {};
      for (var input of inputElements) {
        formData[input.name] = input.value;
      }
      console.log(formData);
      formElement.submit();
    }
  };
}
