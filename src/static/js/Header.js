import Body from "./Body.js";
export default class Header{
    constructor(homePage){
        this.history_btn = document.getElementById("histoire_btn");
        this.math_btn = document.getElementById("math_btn");
        this.hamburger_btn = document.getElementById("hamburger_btn");
        this.floating_side_menu = document.getElementById("floating_side_menu");
        this.float_cross = document.getElementById("menu_cross");

        this.hamburger_btn.addEventListener("click", ()=>{
            floating_side_menu.classList.add("visible")
        })
        this.history_btn.addEventListener("click" , async () => {
            this.historyMode(homePage)
        });
        this.math_btn.addEventListener("click" , async () => {          
            this.mathsMode(homePage)
        });
    
        this.float_cross.addEventListener("click", () => {
            floating_side_menu.classList.remove("visible")
        })
    }

    async mathsMode(homePage){
        const headerBaseColor = "#5271ff";
        const headerSelectedColor   = "#004aad ";
        homePage.selectedMode = "maths";
        let json = await homePage.httpGet("/"+homePage.selectedMode);
        await json.json()
        .then((data) => {
            if (data.type == "Maths"){
                this.math_btn.style.background= headerSelectedColor;
                this.history_btn.style.background= headerBaseColor;
                homePage.main = new Body(homePage).generation_math_exos(data.exercices);
            }else{
                homePage.selectedMode = "";
            }
        })
    }

    async historyMode(homePage){
        const headerBaseColor = "#5271ff";
        const headerSelectedColor   = "#004aad ";
        homePage.selectedMode = "history";
            let json = await homePage.httpGet("/"+homePage.selectedMode);
            await json.json()
            .then((data) => {
                if (data.type == "History"){
                    homePage.selectedMode = "history";
                    this.math_btn.style.background = headerBaseColor; //TODO Add a class rather than adding it directy to it, permit keeping the hover effect
                    this.history_btn.style.background=  headerSelectedColor;
                    homePage.main = new Body(homePage).generate_history(data.content);
                }else{
                    homePage.selectedMode = "";
                }
            })
    }
    
}