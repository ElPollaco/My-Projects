// MAIN CODE WRITTEN IN JAVASCRIPT TO CALCULATE THE CAPITALS AND ENHANCE THE FORM PROCESSING DURING ITS FUNCTION
// AUTHOR: ElPollaco

// GLOBAL FUNCTIONS
let select = document.querySelector("select");
let option = document.querySelectorAll("option");
let newInputs = document.querySelector("#dalej");
let wynik = document.querySelector("#wynik");

// OUTPUT CLEANING FUNCTION
function czyszczenie(){
    newInputs.innerHTML =  ``;
    wynik.innerHTML =  ``;
}

// FUNCTION CREATING COFNIRMATION BUTTON IN FORM
function przycisk(opt){
    let przycisk = document.createElement("input");
    przycisk.setAttribute("onclick", (`weryfikacja()`));
    przycisk.setAttribute("type", (`button`));
    przycisk.setAttribute("value", (`Oblicz`));
    newInputs.appendChild(przycisk);
}

// FUNCTION CREATING SELECT AND OPTIONS FOR TIME SETTING IN FORM
function czasMiar(){
    let timeSel = document.createElement("select");
    timeSel.setAttribute("id", (`czas`));
    newInputs.appendChild(timeSel);

    let timesObj = {
        times: ["podajJednCzas", "mies", "kwart", "procz", "lata"],
        timesKom: ["Podaj jednostki czasu", "Miesiące", "Kwartały", "Półrocza", "Lata"]
    };
    let timeOpt;

    for(let k = 0; k < timesObj.times.length; k++){
        timeOpt = document.createElement("option");
        timeOpt.setAttribute("class", (`okres`));
        timeOpt.setAttribute("value", (`${timesObj.times[k]}`));
        timeOpt.text = (`${timesObj.timesKom[k]}`);
        timeSel.appendChild(timeOpt);
    }
}

// FUNCTION VERYFYING ALL SELECTED AND INPUTED DATA INTO INPUT FIELDS/AREAS
function weryfikacja(){
    let opt = document.querySelectorAll("input[type='number']")
    let time = document.querySelectorAll(".okres");
    let newValuesTable = [];

    for(l = 0; l < time.length; l++)
    if(time[0].selected){
        wynik.innerHTML = `Brakuje formatu czasu. Proszę wybrać inny niż pierwszy.`;
        break;
    }
    else{
        for(let m = 0; m < opt.length; m++){
            if(opt[m].value == ""){
                wynik.innerHTML = `Brakuje liczb w pewnych elementach. Proszę wpisać w brakujące miejsca i spróbować ponownie.`;
                break;
            }
            else{
                newValuesTable.push(opt[m].value);

                let values = {
                    k: 0,
                    kc: 0,
                    p: 0,
                    n: 0,
                    result: 0,
                    wart: 0
                }

                obliczanie(values, newValuesTable, time);
            }
        }
    }
}

// FUCNTION VERIFYING WHAT KIND OF TIME SPLIT HAS BEEN CHOSEN IN TIME SPLIT OPTION FIELD 
// AND ADJUSTING AN ANSWER DEPENDANT BY PERIOD'S LENGTH
function timeVer(data, time, czasMod){
    switch (true){
        case time[1].selected:
            if(data.n == 1){
                czasMod.czasTransform = 'miesiąca';
            }
            else{
                czasMod.czasTransform = 'miesięcy';
            }
            czasMod.pSplit = 12;
            break;
        case time[2].selected:
            if(data.n == 1){
                czasMod.czasTransform  = 'kwartału';
            }
            else{
                czasMod.czasTransform  = 'kwartałów';
            }
            czasMod.pSplit = 4;
            break;
        case time[3].selected:
            if(data.n == 1){
                czasMod.czasTransform  = 'półrocza';
            }
            else{
                czasMod.czasTransform  = 'półroczy';
            }
            czasMod.pSplit = 2;
            break;
        case time[4].selected:
            if(data.n == 1){
                czasMod.czasTransform  = 'roku';
            }
            else{
                czasMod.czasTransform  = 'lat';
            }
            break;
    }
}

// FUNCTION CALCULATING THE DEMANDED VALUE FROM PREVIOUSLY RECEIVED IN ORDER INPUTTED VALUES
function obliczanie(data, newValuesTable, time){
    let czasMod = {
        pSplit: 1,
        czasTransform: ''
    };

    switch(true){
        case option[1].selected:
            data.k = newValuesTable[0];
            data.p = newValuesTable[1] / 100;
            data.n = newValuesTable[2];
            timeVer(data, time, czasMod);

            data.result = (data.k * (1 + data.p)**(data.n / czasMod.pSplit)).toFixed(2);

            wynik.innerHTML = `Twój kapitał oprocentowany na ${data.p * 100}% przez okres ${data.n} ${czasMod.czasTransform} wyniesie ${data.result} zł.`;
            break;
        case option[2].selected:
            data.kc = newValuesTable[0];
            data.p = newValuesTable[1] / 100;
            data.n = newValuesTable[2];
            timeVer(data, time, czasMod);

            data.result = (data.kc / ((1 + data.p)**(data.n / czasMod.pSplit))).toFixed(2);

            wynik.innerHTML = `Twój kapitał początkowy który był oprocentowany na ${data.p * 100}% przez okres ${data.n} ${czasMod.czasTransform} wyniósł na początku ${data.result} zł.`;
            break;
        case option[3].selected:
            data.kc = newValuesTable[0];
            data.k = newValuesTable[1];
            data.n = newValuesTable[2];
            timeVer(data, time, czasMod);

            data.wart = data.kc / data.k;
            data.result = ((Math.pow(data.wart, 1/(data.n / czasMod.pSplit)) - 1) * 100).toFixed(2);

            wynik.innerHTML = `Twój kapitał o wartości ${data.kc} zł ze stanu początkowego ${data.k} zł jest oprocentowany na ${data.result}%.`;
            break;
        case option[4].selected:
            data.kc = newValuesTable[0];
            data.k = newValuesTable[1];
            data.p = newValuesTable[2] / 100;
            timeVer(data, time, czasMod);

            data.wart = data.kc / data.k;
            // ## BUG: INACCURATELY MADE CALCULATION FOR TIME SEARCHING - FIRST PRIORITY BUG, HIGH RISK ERROR ##
            data.result = Math.ceil((Math.log(data.wart) / Math.log(1 + data.p)) / czasMod.pSplit);

            // ## BUG: czasMod.czasTransform FOR THE LAST OPTION IS INADJUSTABLE TO CHANGES FROM FUNCTION timeVer - LAST PRIORITY BUG, LOW RISK ERROR ## 
            wynik.innerHTML = `Twój kapitał o wartości ${data.kc} zł ze stanu początkowego ${data.k} zł zwiększy się w ciągu ${data.result} ${czasMod.czasTransform}.`;
            break;
    }
}

// MAIN FUNCTION EXPANDING FORM BY ADDING ADDITIONAL INPUTS, SELECTS AND BUTTONS VIA PREVIOUSLY MENTIONED FUNCTIONS
select.addEventListener("change", function(){
    for(i = 0; i < option.length; i++){
        if(option[i].selected){     
            czyszczenie();

            switch (true){
                case option[0].selected:
                    document.getElementById("dalej").innerHTML =  `Nie wybrano żadnej opcji.`;
                    break;
                case option[1].selected:
                case option[2].selected:
                case option[3].selected:
                case option[4].selected:
                    let inputData = {
                        placeh: ["Podaj kapitał końcowy", "Podaj kapitał początkowy", "Podaj procent", "Podaj czas"],
                        id: ["kk", "kp", "pr", "cz"]
                    };
                    let opt;

                    for(let j = 0; j < inputData.placeh.length; j++){
                        if(j + 1 == i){
                            continue;
                        }
                        opt = document.createElement("input");
                        opt.setAttribute("type", (`number`));
                        opt.setAttribute("id", (`${inputData.id[j]}`));
                        opt.setAttribute("placeholder", (`${inputData.placeh[j]}`));
                        newInputs.appendChild(opt);
                    }
                    czasMiar();
                    przycisk(opt);
            }
        }
    }
});