/*
Author : Akshay P
Last Modified On :  2025 Sept 24th 
Last Modified By : Akshay P
Important : 
  - needs constructor parameters filled to work properly

Comments : creates HTML after head, body and title is provided  
*/

export class HTMLGenerate {
    createHTMLDoc ({templateHead, templateBody, titleHTML}) {
      let doc = document.implementation.createHTMLDocument(titleHTML);
      doc.head.innerHTML = `${templateHead}`;  
      doc.body.innerHTML = `${templateBody}`;  
      return doc;
    }
  
    generateHTML (doc, name) {
      // Convert the document to a string
      let htmlString = `<!DOCTYPE html>\n${doc.documentElement.outerHTML}`;
  
      // Create a Blob and trigger a download
      this.linkDownload ({name:name, data:htmlString, type:"html"})
      // let blob = new Blob([htmlString], { type: "text/html; charset=utf-8" });
      // let link = document.createElement("a");
      // link.href = URL.createObjectURL(blob);
      // link.download = `${name}.html`; // Filename for the download
      // link.click();
    }

    linkDownload ({name, data, type}) {
      let blob = (type === "html") ? new Blob([data], { type: "text/html; charset=utf-8" })
      : (type === "json") ? new Blob([data], { type: "application/json" }) 
      : new Blob([data], { type: "text/plain" }); 
      let link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${name}.html`; // Filename for the download
      link.click();
    }
  }