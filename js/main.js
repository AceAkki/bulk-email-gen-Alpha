import { HTMLGenerate } from "./classHTML.js";
import { MainClass } from "./classMainClass.js";
import { Utility } from "./classUtility.js";
import { ValidFormMain } from "./classValidForm.js";

const classHTML = new HTMLGenerate();
const classUtility = new Utility();
const classValidForm = new ValidFormMain();
(function init() {
  document.addEventListener("DOMContentLoaded", async (fn) => {
    initHTMLGenerator();
    initPopup();     
  });
})();

async function initHTMLGenerator() {
  let radioGroup = document.querySelector("#radioGrp");
  let selectGroup = document.querySelector("#selectEvent");
  let checkboxElement = document.querySelector("#diffLink");
  let sourceDiv = document.querySelector(".source-wrapper");
  let jsonInput = document.getElementById("json-drop");
  let htmlInput = document.getElementById("html-drop");
  let platform;
  let selectedPlatform;

  classValidForm.checkBoxEvent(checkboxElement); 
  classValidForm.initInputEvent({inputHTML:htmlInput, inputJSON:jsonInput});

  // based on the choice in radio loads to next item for input
  radioGroup.querySelectorAll("input").forEach(input => {
    input.addEventListener("click", (e)=> {  
        if (!e.target.checked) return
        if (sourceDiv.classList.contains("hide")) {
          sourceDiv.classList.remove("hide");
          classUtility.animateIn(sourceDiv, 900);
          classUtility.scrollDelay(sourceDiv, 400);
        }
        platform = e.target.value; 
        document.querySelectorAll(`.source-wrap`).forEach(elm => elm.classList.add("hide"));
        selectedPlatform = document.querySelector(`.source-wrap.${platform}`);
        if (!selectedPlatform.classList.contains("hide")) return
        selectedPlatform.classList.toggle("hide");
        classUtility.animateFade(selectedPlatform, 1200)
        
      })
  })
    

  Array.from(document.getElementsByClassName("nextBtn")).forEach(btn => {
    btn.addEventListener("click", () => {
      // validates selectedPlatform section
      let validForm = classValidForm.validateForm({section: selectedPlatform});
      if (!validForm) return;
      if (btn.closest("#data")) {
        let [htmlData, jsonData] = classValidForm.getInputData();
        let validInput = classValidForm.validateInput({inputHTML:htmlInput, inputJSON:jsonInput, outputHTML:htmlData, outputJSON:jsonData});
        if(!validInput) return;
        let [eventList] = loadEventData(jsonData);  
        // updates select with all events
        eventList.forEach((event) => {
          let optionElm = document.createElement("option");
          optionElm.textContent = event;
          optionElm.value = event;
          selectGroup.appendChild(optionElm);
          selectGroup.removeAttribute("disabled");
        });
      }
      btn.closest(".container").nextElementSibling.classList.remove("hide");
      classUtility.scrollDelay(btn.closest(".container").nextElementSibling, 400);
    });
  })


  // validates all input fields and provides data to htmlRenderer
  document.querySelector("#btnGen").addEventListener("click", () => {
    let validForm = classValidForm.validateForm({section: selectedPlatform});
    let validFormOne = classValidForm.validateForm({section: document.querySelector("#main")});
    let [htmlData, jsonData] = classValidForm.getInputData();
    let validInput = classValidForm.validateInput({inputHTML:htmlInput, inputJSON:jsonInput, outputHTML:htmlData, outputJSON:jsonData});
    
    if (!validForm || !validFormOne || !validInput || platform === undefined ) return;
    let [eventList, eventsData] = loadEventData(jsonData);  

    htmlRenderer({
      templateHTML: htmlData,
      selectElem:selectGroup,
      checkBoxElem: checkboxElement,
      inputServerLink: document.getElementById("serverLink").value,
      inputmpGreet : document.getElementById("mpGreet").value,
      inputntGreet : document.getElementById("ntGreet").value,
      inputmpLink : document.getElementById("mpArchive").value,
      eventList: eventList,
      eventsData: eventsData,
      platform: platform,
    })           

  })
}

// renders htmls based on the provided data
async function htmlRenderer({templateHTML, selectElem, checkBoxElem, inputServerLink, inputmpGreet, inputntGreet, inputmpLink, htmlTitle, eventList, eventsData, platform}) {
    let allHTML = new Map();
    console.log(selectElem.value)
    const parser = new DOMParser();
    let doc = parser.parseFromString(templateHTML, "text/html");
    let docHTML = classHTML.createHTMLDoc({
      templateHead: doc.querySelector("head").outerHTML,
      templateBody: doc.querySelector("body").outerHTML,
      titleHTML: htmlTitle,
    });
    allHTML.set(selectElem.value, docHTML);

    // initiates mainClass and generates content 
    eventList.forEach((event) => {
      // let registerURL = Object.values(eventsData[event]).find((value) => typeof value === "string" && value.includes("http"));
      // let eventTitle = Object.values(eventsData[event]).find((value) => typeof value === "string" && !value.includes("http"));
      // let citiesData = Object.values(eventsData[event]).find((value) => typeof value === "object");
      let registerURL = eventsData[event].baseURL;
      let eventTitle = eventsData[event].eventTitle;
      let citiesData = eventsData[event].cities;
      let cityList = Object.keys(citiesData);

      let mainClass = new MainClass({
        mainRegisterLink: registerURL,
        mainServerLink: inputServerLink,
        eventTitle: eventTitle,
        greetMergetag: inputmpGreet,
        greetNormal: inputntGreet,
        archiveMergetag : inputmpLink,
        defaultTemplate: [event],
      });

      mainClass.generateContent({
        eventData: eventsData[event],
        cityList: cityList,
        citiesData: citiesData,
        allHTML: allHTML,
        platform: platform,
        dynamicLink: mainClass.getBoolean(checkBoxElem.checked),
      });
    });
}

// fetches data and populates the template options based on provided json and returns data as well
function loadEventData(rawData) {
  //let eventsData = await classUtility.fetchData(rawData);
  let eventData = JSON.parse(rawData);
  let eventList = Object.keys(eventData);
  return [eventList, eventData];
}


function initPopup() {
  document.querySelector(".menu-wrap").addEventListener("click", (e)=> {
    if (e.target.tagName === "BUTTON" || e.target.classList.contains("ph-info")) {
      createPopup()
    }
   })
}

// helper function being used in initPopup
function createPopup() {
  let bgClass = "bgOverlay";
  let popupClass = "popup";
  if (document.getElementsByClassName(bgClass).length > 0 && document.getElementsByClassName(popupClass).length > 0) {
    document.getElementsByClassName(popupClass)[0].remove();
    document.getElementsByClassName(bgClass)[0].remove();
    return;
  }
  let bgOverlay = document.createElement("div");
  bgOverlay.classList.add(bgClass)
  document.body.appendChild(bgOverlay);
  let popup = document.createElement("div");
  popup.classList.add(popupClass);
  document.body.appendChild(popup);
  popup.innerHTML = `
  <div class="popup-wrap">
  <h2> Bulk Mailer Generator </h2>

  <h5> Instructions:</h5>

      <p>
          Two types of mailers can be generated from this
          <ol> 
              <li> 
                  Merge Tag based
              </li>
              <li>
                  Normal
              </li>
          </ol>
      </p>

      <ul>
          <li>
          "/fileName-Normal.html" this will be included in the serverlink 
          </li>
      </ul>
  </div>

  `
  bgOverlay.addEventListener("click", ()=> {
    popup.remove();
    bgOverlay.remove();
  })
  
}
