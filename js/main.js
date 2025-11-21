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
    <h2>Bulk Mailer Generator</h2>

    <p>
        Follow these steps to generate mailers for multiple cities or events using your HTML template and JSON data.
    </p>

    <h5>Instructions:</h5>

    <hr>

    <h3>1️⃣ Select Platform Type</h3>
    <p>Choose the mode depending on how your mailers should be generated:</p>

    <h4>✔ Merge Tag Mode</h4>
    <ul>
        <li>Enter <strong>Greet Message Merge Tag</strong></li>
        <li>Enter <strong>Archive Merge Tag</strong></li>
    </ul>

    <h4>✔ Normal Mode</h4>
    <ul>
        <li>Enter <strong>Normal Greet Message</strong></li>
        <li>Enter <strong>Server URL</strong> (used to build archive links)</li>
         <li><strong>Important:</strong> The Server URL must be a proper base link.<br>
            Example: <code>https://example.com/archive</code><br>
            The generator will append <code>/fileName-Normal.html</code> to this base link.
        </li>
    </ul>

    <p>Click <strong>Add Info</strong> to proceed.</p>

    <hr>

    <h3>2️⃣ Upload Required Files</h3>
    <p>You must upload both files for the generator to work:</p>

    <h4>📄 JSON Data File</h4>
    <ul>
        <li>Contains all event/city information.</li>
        <li>Must follow the fixed JSON structure.</li>
        <li>A sample JSON is available for download.</li>
    </ul>

    <h4>📄 HTML Template</h4>
    <ul>
        <li>The mailer layout used for generating outputs.</li>
        <li>Dynamic elements must include specific class names so the script can insert data.</li>
        <li>Sample HTML template is available for download.</li>
        <li>Common class names include:
            <ul>
                <li>.cityName</li>
                <li>.eventDate</li>
                <li>.bannerImage</li>
                <li>.ctaLink</li>
            </ul>
        </li>
    </ul>

    <p>Click <strong>Add Data</strong> after uploading.</p>

    <hr>

    <h3>3️⃣ Select the Event</h3>
    <p>After the JSON file loads successfully:</p>
    <ul>
        <li>The dropdown will display all events or cities found in the JSON.</li>
        <li>Select an event to preview or generate mailers.</li>
    </ul>

    <hr>

    <h3>4️⃣ Dynamic Link Option</h3>
    <p>You can control how links are generated:</p>
    <ul>
        <li><strong>Checked:</strong> Uses dynamic link from JSON.</li>
        <li><strong>Unchecked:</strong> Uses static link from the HTML template.</li>
    </ul>

    <hr>

    <h3>5️⃣ Generate Files</h3>
    <p>Click <strong>Generate Files</strong> to create:</p>
    <ul>
        <li>Individual mailers for each event/city</li>
        <li>Dynamic fields replaced based on JSON data</li>
        <li>HTML files ready for upload or sending</li>
    </ul>

    <hr>

    <h3>📌 Important Notes</h3>
    <ul>
        <li>The JSON structure must remain unchanged.</li>
        <li>Every JSON field must match a class name in the HTML template.</li>
        <li>Ensure all image URLs and CTA links in the JSON are correct.</li>
        <li>Merge Tag mode inserts merge tags instead of static values.</li>
    </ul>

    <hr>

    <h3>💡 Tip</h3>
    <p>
        Download the sample JSON & HTML template to understand the required formatting of data, class names, and dynamic fields.
    </p>
</div>


  `
  bgOverlay.addEventListener("click", ()=> {
    popup.remove();
    bgOverlay.remove();
  })
  
}
