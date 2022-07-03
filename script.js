const fromText = document.querySelector(".from-text");
toText = document.querySelector(".to-text");
exchangeIcon = document.querySelector(".exchange");
selectTag = document.querySelectorAll("select");
translateBtn = document.querySelector("button");
icons = document.querySelectorAll(".icons");
microphone = document.querySelector(".fa-microphone");

selectTag.forEach((tag,id) => {

    for (const country_code in countries_lang) {

        //selecting English by default as FROM language and Hindi as TO language

      let selected;
            if (id==0 && country_code=="en-GB")
                selected="selected";

               else if(id==1 && country_code=="hi-IN")
               selected="selected";

        

        //adding options in select element
        
        let option=`<option value=${country_code} ${selected}>${countries_lang[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend",option);
    }


    }
);

//adding text translation feature

translateBtn.addEventListener("click",()=>{
    let text = fromText.value;
    translateFrom = selectTag[0].value; //getting fromSelect tag value
    translateTo = selectTag[1].value;   //getting toSelect tag value
    
    if(!text) return;
    toText.setAttribute("placeholder","Translating...")
    let apiUrl=`https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    fetch(apiUrl)
    .then(res=>res.json())
    .then(data=> { 
        console.log(data);
        toText.value = data.responseData.translatedText;
        toText.setAttribute("placeholder","Translation")
    });
});

//adding swap languages features

exchangeIcon.addEventListener("click", ()=> {

    let tempText=fromText.value;
    let tempLang =selectTag[0].value;
    fromText.value= toText.value;
    selectTag[0].value = selectTag[1].value;
    toText.value= tempText;
    selectTag[1].value= tempLang;
});


fromText.addEventListener("keyup", () => {
    if(!fromText.value) {
        toText.value = "";
    }
    
});

//adding functions to clipboard icon and speaker icon and microphone icon


icons.forEach(icon =>{
    icon.addEventListener("click",({target})=>{
        
        //adding functions to clipboard icon 
        
        if (target.classList.contains("fa-copy")){
            if(target.id=="from"){
            navigator.clipboard.writeText(fromText.value);
            }

        else{
            navigator.clipboard.writeText(toText.value);
            }
        }
        
        //adding functions to speaker icon 
        else if (target.classList.contains("fa-volume-high")) {
            let utterance
            if (target.id=="from"){
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value;
            }
            else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value;
            }
           
            speechSynthesis.speak(utterance);
        }

        
    });

});


//adding function to the microphone icon 

let recognition = new window.webkitSpeechRecognition();
recognition.lang = selectTag[0].value;
recognition.continuous = true;
recognition.interimResults = true;
microphone.addEventListener("click", ()=>{
   microphone.classList.toggle("speech");

   if (microphone.classList.contains("speech")){
    startRec();
   }

   else{
    stopRec();
   }
});

const startRec =() => {
    recognition.start();
    recognition.onresult = event =>{
        let text = Array.from(event.results)
        .map(r => r[0])
        .map(txt => txt.transcript)
        .join(" ");
        fromText.value = text;
    }
}

const stopRec =() =>{
recognition.stop();
}