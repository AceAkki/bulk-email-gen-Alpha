export class ValidFormMain {
          errClass = "error-field"
    errMsgSelector = ".error-msg"
        // function to track checkbox event 
    checkBoxEvent (checkBox) {
        checkBox.addEventListener("click", ()=> {
          if(checkBox.getAttribute("checked") === " " || checkBox.getAttribute("checked") === "") {
            checkBox.removeAttribute("checked");
          } else {
            checkBox.setAttribute("checked", "")
          }
        })
    }

    radioEvent (radioGroup) {
      let value;
      radioGroup.querySelectorAll("input").forEach(input => {
        input.addEventListener("click", (e)=> {  
          if (e.target.checked) value = e.target.value; 
          console.log(value)
        })
      })
      radioGroup.querySelectorAll("input").forEach(input => { if(input.checked) value = input.value;});
      return value; 
    }

    validateForm({section}) {
      //if (typeof(func) !== "function") { console.log("func parameter should be a function"); return }
      let isValid = true;  

      const fields = section.querySelectorAll("input, select"); // textarea, select  // commented out because we let users use without select
      fields.forEach((field) => {
          let hasError = false;
          if (field.value.trim() === "" || field.value === "0" || field.value === "null") {
              hasError = true;
              console.log(field)
          } 

          // shows error message
          if (hasError && field.type !== "radio") {
              field.classList.add(this.errClass);
              if (!field.parentNode.querySelector(this.errMsgSelector)) {
                this.addErrorMessage(field);
              }
          }

          // if(field.type === "radio") {
          //   if (!field.checked) hasError = true;
          //  }

          // if (hasError && field.type === "radio") {
          //     field.parentNode.parentNode.classList.add(this.errClass);
          //     if (!field.parentNode.parentNode.querySelector(this.errMsgSelector)) {
          //       this.addErrorMessage(field);
          //     }
          // }
          // on input removes the error message
          field.addEventListener("input", () => {
            if (!(field.value.trim() === "")) {
                if (field.classList.contains(this.errClass)) {
                  field.classList.remove(this.errClass);
                }
                if (field.parentNode.querySelector(this.errMsgSelector)) {
                  field.parentNode.querySelector(this.errMsgSelector).remove();
                }
              }
          });

          // checks if error exist, focuses on that elem and flags invalid, error
          if (section.getElementsByClassName("error-field")[0]) {
            section.getElementsByClassName("error-field")[0].focus();     
            isValid = false;
            hasError = true;
          }            

      });

      return isValid
    }

    outputHTML;
    outputJSON;
    // adds the input event
    initInputEvent({inputHTML, inputJSON}) {
      [inputHTML, inputJSON].forEach(input => {
        input.addEventListener("change", (e) => {
          this.fileReader(e.target.files[0]).then(result => {
            (input.getAttribute("id").includes("html")) ? this.outputHTML = result : this.outputJSON = result;
          });  
        })
      })
    }

    // gets the inputdata
    getInputData() {
      return [ this.outputHTML, this.outputJSON];
    }

    // validates input and returns true
    validateInput({inputHTML, inputJSON, outputHTML, outputJSON}) {
      let isValid = true;
        this.validInputHelper(outputHTML, inputHTML, isValid);
        this.validInputHelper(outputJSON, inputJSON, isValid);
      return isValid
    }
    /*
    --------------------------------------------------------------------------------------------
    -------------------------------/ Helper Methods  /------------------------------------------
    --------------------------------------------------------------------------------------------

    */

    validInputHelper(outputElm, inputElm, flag){
      if (outputElm === undefined || outputElm === null) {
        inputElm.classList.add(this.errClass);
        if(!inputElm.parentNode.querySelector(this.errMsgSelector)) this.addErrorMessage(inputElm);
        flag = false;
      } else if (outputElm !== undefined &&  inputElm.parentNode.querySelector(this.errMsgSelector)) {
        inputElm.classList.remove(this.errClass);
        inputElm.parentNode.querySelector(this.errMsgSelector).remove();
      }
    }

    addErrorMessage(field) {
      let fieldtype = field.type;
      let errMsg = document.createElement("p");
      errMsg.classList.add("error-msg");
      if (field.value === "0" || fieldtype === "radio" || fieldtype === "checkbox") {
        // errMsg.textContent = field.querySelector("option").textContent.trim();
        errMsg.textContent = "Please select one option";
      } else {
        // placeholder text warning
        // errMsg.textContent = field.getAttribute("placeholder");
        // generic warning
        //errMsg.textContent = "Please fill out this field.";
        errMsg.textContent = "This field can't be left empty";
      }

      if (fieldtype === "radio" || fieldtype === "checkbox") {
          field.parentNode.parentNode.appendChild(errMsg);
      } else {
          field.parentNode.appendChild(errMsg);
      }

    }

}
