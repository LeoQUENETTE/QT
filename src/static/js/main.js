import Body from "./Body.js";
import Header from "./Header.js";
import Footer from "./Footer.js";

 

class HomePage{

    constructor(){
        this.lang = "English"
        this.selectedMode = null;
        this.header = new Header(this);
        this.body = new Body(this);
        this.footer = new Footer(this);
    }
    async httpGet(url)
    {
        return await fetch(url, {
            headers: {
                'Accept': 'application/json'
            }  
        });
    };
    async httpPost(url, jsonBody)
    {
        return await fetch(url, {
            method: "POST",
            body: jsonBody,
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
    }


}


const homePage = new HomePage()

