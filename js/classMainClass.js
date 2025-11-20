import { HTMLGenerate } from "./classHTML.js";

const classHTML = new HTMLGenerate();
export class MainClass {
    constructor({mainRegisterLink, mainServerLink, eventTitle, greetMergetag, greetNormal, archiveMergetag, defaultTemplate}) {
      this.baseLink = mainRegisterLink,
      this.serverLink = mainServerLink,
      this.title = eventTitle,

      this.mergetagGreet = greetMergetag,
      this.normalGreet = greetNormal,
      this.mergetagArchive = archiveMergetag,

      this.linkArchive = "archivelink";
      this.textGreet = "greet";        
      this.linkRegister = "register-link";
      this.linkCalendar = "calendar-link";
      this.textCity = "city-name";
      this.textDate = "date";
      this.textDay = "day";
      this.textAddress = "add";
      this.textTime = "time";
      this.default = defaultTemplate;

      this.mergeOption = "mergeTag";
      this.normalOption = "normal"
    }
    
    generateContent({eventData, cityList, citiesData, allHTML, platform, dynamicLink}) {
      cityList.forEach(city => {
        let cityData = citiesData[city];
        // console.log(cityData)
        let [day, date] = cityData.VenueDate.split(",");
        let [startTime, endTime] = cityData.VenueTime.split("to");
  
        for (const [key, value] of allHTML) {
          let cityCountry;
          cityData.Countries ? cityCountry = cityData.Countries.includes(key) : cityCountry = null;
          if (cityCountry || this.default.includes(key)) {
            if(value.getElementsByClassName(this.linkRegister)[0]) {
              Array.from(value.getElementsByClassName(this.linkRegister)).forEach(elm => { 
                dynamicLink ? elm.href = `${this.baseLink}${cityData.VenueCity}` : elm.href = `${this.baseLink}` });
            }
            if(value.getElementsByClassName(this.linkCalendar)[0]) {
              Array.from(value.getElementsByClassName(this.linkCalendar)).forEach(elm => { elm.href = `${this.makeGCalLink({eventData:eventData, cityData:cityData, newDate:date.trim(), startTime:startTime.trim(), endTime:endTime.trim()})}` });
            }
            if(value.getElementsByClassName(this.textCity)[0]) {
              Array.from(value.getElementsByClassName(this.textCity)).forEach(elm => { elm.textContent = `${cityData.VenueCity}`});
            }
            if(value.getElementsByClassName(this.textDate)[0]) {
              Array.from(value.getElementsByClassName(this.textDate)).forEach(elm => { elm.textContent = `${date.trim()}`});
            }
            if (value.getElementsByClassName(this.textDay)[0]) {
              Array.from(value.getElementsByClassName(this.textDay)).forEach(elm => { elm.textContent = `${day.trim()}`});

            }
            if(value.getElementsByClassName(this.textAddress)[0]) {
              Array.from(value.getElementsByClassName(this.textAddress)).forEach(elm => { elm.textContent = `${cityData.VenueAdd}` });
            }
            if(value.getElementsByClassName(this.textTime)[0]) {
              Array.from(value.getElementsByClassName(this.textTime)).forEach(elm => { elm.textContent = `${cityData.VenueTime}`; });
            }           


            this.mapPlatform (platform, value, `${cityData.VenueCity}-${key}`);
            //console.log(platform, platform === this.mergeOption);
            (platform === this.mergeOption) ? classHTML.generateHTML(value, `${cityData.VenueCity}-${key}`) :
              classHTML.generateHTML(value, `${cityData.VenueCity}-${key}-Normal`);
          } else {
            console.log(`${key} missing from data`)
          }
        }
      })
    }

    // generates URL that can be used as the server link
    generateURL (fileName) {
      // let months = [
      //   "Jan",
      //   "Feb",
      //   "Mar",
      //   "Apr",
      //   "May",
      //   "Jun",
      //   "Jul",
      //   "Aug",
      //   "Sept",
      //   "Oct",
      //   "Nov",
      //   "Dec",
      // ];
      // let date = new Date ();
      // return `${this.serverLink}${date.getFullYear()}/${months[date.getMonth()].toLowerCase()}${date.getFullYear().toString().replace("20", "")}/${fileName}-Normal.html`
      return `${this.serverLink}/${fileName}-Normal.html`
    }
  
    // maps platform and according to the map updates greeting and archive link
    mapPlatform (platform, doc, fileName) {   
      const map = new Map();
      map.set(this.mergeOption, { "greet" : this.mergetagGreet, "archive" : this.mergetagArchive })
      map.set(this.normalOption, { "greet" : this.normalGreet, "archive" : this.generateURL(fileName)})
      console.log(map)
      if (platform === this.mergeOption) {
        Array.from(doc.getElementsByClassName(this.linkArchive)).forEach(elm => { elm.href = map.get(this.mergeOption).archive; });
        Array.from(doc.getElementsByClassName(this.textGreet)).forEach(elm => { elm.textContent = map.get(this.mergeOption).greet; });
      } else if (platform === this.normalOption) {
        Array.from(doc.getElementsByClassName(this.linkArchive)).forEach(elm => { elm.href = map.get(this.normalOption).archive; });
        Array.from(doc.getElementsByClassName(this.textGreet)).forEach(elm => { elm.textContent = map.get(this.normalOption).greet; });
      }
    }

    // returns google calendar date link that will be used in the mailer
    makeGCalLink({eventData, cityData, newDate, startTime, endTime}) {
      var link;
      link = "http://www.google.com/calendar/event?action=TEMPLATE";
      link += "&dates=" + this.formatCalDate(newDate, startTime, endTime);
      link += "&text=" + encodeURIComponent(this.title + " - " + cityData.VenueCity);
      link += "&location=" + encodeURIComponent(cityData.VenueAdd);
      link +=
        "&details=" +
        encodeURIComponent(eventData.googleMsg);
    
      return link;
    }

    //-----------------------------------------------------------------------------------------------
    //------------------------ Helper Methods
    //-----------------------------------------------------------------------------------------------
 
    // format calendat date - used in makeGCalLink 
    formatCalDate(newDate, startTime, endTime) {
      let getYear = ()  =>{
        let date = new Date();
        return date.getFullYear();
      }
      let date = (time) => {
        let current = new Date(`${newDate.replace(/[a-z]+/, "")} ${getYear()} ${time}`)
        //console.log(current.toISOString().replace(/(?:\.)\d+/, "").match(/[A-Za-z0-9_]/g).join(""))
        return current.toISOString().replace(/(?:\.)\d+/, "").match(/[A-Za-z0-9_]/g).join("");
      }
      //(?:\.)\d+
      let ftStart = date(startTime);
      let ftEnd = date(endTime);
      let formatted = `${ftStart}%2F${ftEnd}`;
      //console.log(formatted)
      return formatted;
    }

    // used solely to get a boolean
    getBoolean(condition) {
      return (condition) ? true : false;
      // if(condition) {
      //   return true
      // } else {
      //   return false
      // }
    }
 
  
}
  
