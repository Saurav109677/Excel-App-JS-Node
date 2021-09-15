

//jquery for dom manipulation
// although document is there in js to manipulate dom but jquery gives extra freature

// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
const $ = require('jquery')
// const dialog = require("electron").remote
// const { dialog } = require('electron');
// const dialog = require('electron').remote.dialog
const remote = require('@electron/remote')
// const dialog = remote.dialog;
const fs = require("fs");
const { log } = require('console');


let db = [];
let lastCellVisited ;
let sheetsDb = [];
let selectedSheetIndex = 0;

$("document").ready(function(){

    console.log("loaded")

    $(".sheet").on("click",function(){
        console.log($(this).attr("sid"));
        $(`.sheet.active-sheet`).removeClass("active-sheet");
        $(this).addClass("active-sheet");
        selectedSheetIndex = $(this).attr("sid");
        //update db
        db = sheetsDb[selectedSheetIndex];
        console.log("zzz",db);
        //update ui
        for(let i=0;i<100;i++){
            for(let j=0;j<26;j++){
                $(`.cell[rid=${i}][cid=${j}]`).text(db[i][j].value);
                $(`.cell[rid=${i}][cid=${j}]`).css("color",db[i][j].color);
                $(`.cell[rid=${i}][cid=${j}]`).css("background-color",db[i][j].background);
                 $(`.cell[rid=${i}][cid=${j}]`).css("text-decoration",db[i][j].underline?"underline":"");
                 $(`.cell[rid=${i}][cid=${j}]`).css("align-text",db[i][j].align);
                $(`.cell[rid=${i}][cid=${j}]`).css("font-family",db[i][j].font);
                 $(`.cell[rid=${i}][cid=${j}]`).css("font-size",db[i][j].size+"px");
                  $(`.cell[rid=${i}][cid=${j}]`).css("font-style",db[i][j].italic?"italic":"");
                $(`.cell[rid=${i}][cid=${j}]`).css("font-weight",db[i][j].bold?"bold":"");
            }
        }

    })

    $(".add-sheet").on("click",function(){
        $(`.sheet.active-sheet`).removeClass("active-sheet");
        let newSheetDiv = `<div class ="sheet active-sheet" sid="${sheetsDb.length}">Sheet ${sheetsDb.length+1}</div>`
        $(".sheets-list").append(newSheetDiv);
        $("#address").val("");
        init();
        // console.log(sheetsDb);
        // update ui
        for(let i=0;i<100;i++){
            for(let j=0;j<26;j++){
                $(`.cell[rid=${i}][cid=${j}]`).html("");
                $(`.cell[rid=${i}][cid=${j}]`).attr("style","");
            }
        }

        $(".sheet.active-sheet").on("click",function(){
            // console.log($(this).attr("sid"));
            $(`.sheet.active-sheet`).removeClass("active-sheet");
            $(this).addClass("active-sheet");
            selectedSheetIndex = $(this).attr("sid");
            //update db
            db = sheetsDb[selectedSheetIndex];
            console.log("zzz",db);
            //update ui
            for(let i=0;i<100;i++){
                for(let j=0;j<26;j++){
                    $(`.cell[rid=${i}][cid=${j}]`).text(db[i][j].value);
                    $(`.cell[rid=${i}][cid=${j}]`).css("color",db[i][j].color);
                    $(`.cell[rid=${i}][cid=${j}]`).css("background-color",db[i][j].background);
                    $(`.cell[rid=${i}][cid=${j}]`).css("text-decoration",db[i][j].underline?"underline":"");
                    $(`.cell[rid=${i}][cid=${j}]`).css("align-text",db[i][j].align);
                    $(`.cell[rid=${i}][cid=${j}]`).css("font-family",db[i][j].font);
                    $(`.cell[rid=${i}][cid=${j}]`).css("font-size",db[i][j].size+"px");
                    $(`.cell[rid=${i}][cid=${j}]`).css("font-style",db[i][j].italic?"italic":"");
                    $(`.cell[rid=${i}][cid=${j}]`).css("font-weight",db[i][j].bold?"bold":"");
                }
            }
        })

    })


    $("#font-color").change(function(){
        let newColor = $(this).val();
        let lastCellRowId = $(lastCellVisited).attr("rid");
        let lastCellColId = $(lastCellVisited).attr("cid");
         $(`.cell[rid=${lastCellRowId}][cid=${lastCellColId}]`).css("color",newColor);  
        db[lastCellRowId][lastCellColId].color = newColor;
    })

     $("#font-background").change(function(){
        let newColor = $(this).val();
        let lastCellRowId = $(lastCellVisited).attr("rid");
        let lastCellColId = $(lastCellVisited).attr("cid");
         $(`.cell[rid=${lastCellRowId}][cid=${lastCellColId}]`).css("background-color",newColor);  
         db[lastCellRowId][lastCellColId].background = newColor;
    })

    $("#left-align").click(function(){
          let lastCellRowId = $(lastCellVisited).attr("rid");
        let lastCellColId = $(lastCellVisited).attr("cid");
         $(`.cell[rid=${lastCellRowId}][cid=${lastCellColId}]`).css("text-align","left");  
        db[lastCellRowId][lastCellColId].align = "left";
    })

     $("#center-align").click(function(){
          let lastCellRowId = $(lastCellVisited).attr("rid");
        let lastCellColId = $(lastCellVisited).attr("cid");

           $(`.cell[rid=${lastCellRowId}][cid=${lastCellColId}]`).css("text-align","center");  
             db[lastCellRowId][lastCellColId].align = "center";
    })

     $("#right-align").click(function(){
          let lastCellRowId = $(lastCellVisited).attr("rid");
        let lastCellColId = $(lastCellVisited).attr("cid");
         $(`.cell[rid=${lastCellRowId}][cid=${lastCellColId}]`).css("text-align","right");  
         db[lastCellRowId][lastCellColId].align = "right";
    })

    $("#font-size").click(function(){
         let lastCellRowId = $(lastCellVisited).attr("rid");
        let lastCellColId = $(lastCellVisited).attr("cid");

        // let size = db[lastCellRowId][lastCellColId].size;
        let newSize = this.value;
         db[lastCellRowId][lastCellColId].size = newSize;
        $(`.cell[rid=${lastCellRowId}][cid=${lastCellColId}]`).css("font-size",newSize+"px");
    })

     $(".underline-button").click(function(){
        let lastCellRowId = $(lastCellVisited).attr("rid");
        let lastCellColId = $(lastCellVisited).attr("cid");
    
        db[lastCellRowId][lastCellColId].underline = !db[lastCellRowId][lastCellColId].underline;
        let style = "none"
        if(db[lastCellRowId][lastCellColId].underline){
            style = "underline";
            $(".underline-button").addClass("underline-button-style");
        }
        else{
            $(".underline-button").removeClass("underline-button-style");
        }
    
        $(`.cell[rid=${lastCellRowId}][cid=${lastCellColId}]`).css("text-decoration",style);
        
    })

    $(".italic-button").click(function(){
        let lastCellRowId = $(lastCellVisited).attr("rid");
        let lastCellColId = $(lastCellVisited).attr("cid");
    
        db[lastCellRowId][lastCellColId].italic = !db[lastCellRowId][lastCellColId].italic;
        let style ="normal";
        if(db[lastCellRowId][lastCellColId].italic){
            style = "italic";
            $('.italic-button').css("background-color","lightblue");
        }
        else{
            $('.italic-button').css("background-color","");
        }    
        $(`.cell[rid=${lastCellRowId}][cid=${lastCellColId}]`).css("font-style",style);
        
    })


    $(".bold-button").click(function(){
        let lastCellRowId = $(lastCellVisited).attr("rid");
        let lastCellColId = $(lastCellVisited).attr("cid");
    
        db[lastCellRowId][lastCellColId].bold = !db[lastCellRowId][lastCellColId].bold;
        let boldWeight ="normal";
        if(db[lastCellRowId][lastCellColId].bold){
            boldWeight = "bold";
            $('.bold-button').css("background-color","lightblue");
        }
        else{
            $('.bold-button').css("background-color","");
        }    
        $(`.cell[rid=${lastCellRowId}][cid=${lastCellColId}]`).css("font-weight",boldWeight);
        
    })

    $("#font-style").on("change",function(){
        // console.log($(this).val());
        // console.log(this.value);
        let lastCellRowId = $(lastCellVisited).attr("rid");
        let lastCellColId = $(lastCellVisited).attr("cid");
        $(`.cell[rid=${lastCellRowId}][cid=${lastCellColId}]`).css("font-family",this.value);
        db[lastCellRowId][lastCellColId].font = this.value;
    })

    $(".new-option").on("click",function(){
        db=[] ;
        for(let i=0;i<100;i++){
            let row=[];
            for(let j=0;j<26;j++){
                let cellAdd = String.fromCharCode(65+j)+(i+1);
                 let cellObject = {
                        name : cellAdd,
                        value : "",
                        formula : "",
                        childrens : [],
                        parents : [],
                        font : "Arial",
                        bold : false ,
                        underline : false,
                        italic : false,
                        size : "16",
                        align : "center",
                        color : "",
                        background : ""
                 }
    
                row.push(cellObject);
                $(`.cell[rid=${i}][cid=${j}]`).html("");
                $(`.cell[rid=${i}][cid=${j}]`).attr("style","");
                
                
            }
            db.push(row);
           
        }
    })

    $(".open-option").on("click",function(){
        let filePath= remote.dialog.showOpenDialogSync();
        let dataString = fs.readFileSync(filePath[0],'utf-8');
        let data = JSON.parse(dataString);
        console.log(data);
        db = data;
        //update UI
        for(let i=0;i<100;i++){
            for(let j=0;j<26;j++){
                $(`.cell[rid=${i}][cid=${j}]`).text(db[i][j].value);
                $(`.cell[rid=${i}][cid=${j}]`).css("color",db[i][j].color);
                $(`.cell[rid=${i}][cid=${j}]`).css("background-color",db[i][j].background);
                 $(`.cell[rid=${i}][cid=${j}]`).css("text-decoration",db[i][j].underline?"underline":"");
                 $(`.cell[rid=${i}][cid=${j}]`).css("align-text",db[i][j].align);
                $(`.cell[rid=${i}][cid=${j}]`).css("font-family",db[i][j].font);
                 $(`.cell[rid=${i}][cid=${j}]`).css("font-size",db[i][j].size+"px");
                  $(`.cell[rid=${i}][cid=${j}]`).css("font-style",db[i][j].italic?"italic":"");
                $(`.cell[rid=${i}][cid=${j}]`).css("font-weight",db[i][j].bold?"bold":"");
            }
        }
        
    })

    $(".save-option").on("click",function(){
        let filePath = remote.dialog.showSaveDialogSync();
        let data = JSON.stringify(db);
        fs.writeFileSync(filePath , data);
        alert('File Saved!');
    })

    $(".file-menu").on("click",function(){
        console.log("file clicked");
        $(".file-menu-option").css("display","flex");
         $(".home-menu-option").css("display","none");

         $(this).addClass("selected-menu-option");
         $(".home-menu").removeClass("selected-menu-option");

    })

    $(".home-menu").on("click",function(){
        console.log("home clicked");
        $(".home-menu-option").css("display","flex");
         $(".file-menu-option").css("display","none");

         $(this).addClass("selected-menu-option");
         $(".file-menu").removeClass("selected-menu-option");
    })


    $(".content").on("scroll",function(){
       let left =  $(this).scrollLeft();
        let top = $(this).scrollTop();
        $(".top-row").css("top",top+"px");
        $(".top-row-cell").css("top",top+"px");

        $(".left-col").css("left",left+"px")
        $(".left-col-cell").css("left",left+"px")

        $(".top-left-corner").css("left",left+"px")
        $(".top-left-corner").css("top",top+"px")        
    })

    $(".cell").on("keyup",function(){
        let height = $(this).height();
        let rowId = $(this).attr("rid");
        $(`.left-col-cell[cellId=${rowId}]`).css("height",height)
    })
    
    $(".cell").on("click",function(){
        let rowId = Number($(this).attr("rid"))+1;
        let colId = Number($(this).attr("cid"));
        let cellAdd = String.fromCharCode(65+colId)+rowId;
        // let charColId = String.fromCharCode(65+colId) 
        // console.log(rowId , charColId);
        
        $("#address").val(cellAdd);
        $("#formula").val(db[rowId-1][colId].formula);
        $("#font-style").val(db[rowId-1][colId].font);
        $("#font-size").val(db[rowId-1][colId].size)

        //bold
        if(db[rowId-1][colId].bold)
             $('.bold-button').css("background-color","lightblue");
        else    
             $('.bold-button').css("background-color","");

        //italic
        if(db[rowId-1][colId].italic)
             $('.italic-button').css("background-color","lightblue");
        else    
            $('.italic-button').css("background-color","");

        //underline
        if(db[rowId-1][colId].underline)
             $('.underline-button').addClass("underline-button-style");
        else    
            $('.underline-button').removeClass("underline-button-style");

        $('#font-color').val(db[rowId-1][colId].color);
        $('#font-background').val(db[rowId-1][colId].background);
    })

    $("#formula").on("blur", function(){
        let formula = $(this).val();
        //let address = $("#address").val();
        let lastCellRowId = $(lastCellVisited).attr("rid");
        let lastCellColId = $(lastCellVisited).attr("cid");
        let cellObject = db[lastCellRowId][lastCellColId];

        // if smae formula is written , why to re-calculate
        if(cellObject.formula != formula){
            removeFormula(cellObject);
            let answer = solveFormula(formula , cellObject);
            //update in db
                db[lastCellRowId][lastCellColId].value=answer+"";
                db[lastCellRowId][lastCellColId].formula=formula+"";
            //update the childrens also
                 updateChildren(cellObject);
                //console.log(db[lastCellRowId][lastCellColId]);
            //update in ui
                $(lastCellVisited).text(answer);

        }
    })

    function solveFormula(formula , cellObject){
        let fComponents = formula.split(" ");
        console.log(fComponents);
        for(let i=0;i<fComponents.length;i++){
            let fComp = fComponents[i];
            if(fComp[0]>='A' && fComp[0]<='Z'){
                let cellName = fComp;
                let {rowId,colId} = getRowAndColId(cellName);
                //console.log(rowId,colId);
                let parentCellObj = db[rowId][colId];
                formula = formula.replace(cellName,parentCellObj.value);

                if(cellObject){
                    // adding child name or dependents cell nameto respective parent cell
                    addSelfToParentsChildrens(parentCellObj , cellObject);

                    //  adding parent cell name OR dependents cell name to the last selected cell
                    updateParentsOfSelfCellObject(cellObject , cellName);
                }
            }
        }
        // console.log(formula);
        return eval(formula);
    }

    function addSelfToParentsChildrens(parentObj , selfObj){
        // B1 will be added to A1 and A2 childrens
        parentObj.childrens.push(selfObj.name);
    }

    function updateParentsOfSelfCellObject(selfObj, parentCellName){
        // B1 will add A1 and A2 in its parents field
        selfObj.parents.push(parentCellName);
    }

    function getRowAndColId(cellName){
        return {
            colId : cellName.charCodeAt(0)-65,
            rowId :Number(cellName.substring(1))-1
        }
    }

    $(".cell").on("blur",function(){
        lastCellVisited = this;
        let value = $(this).text();
        let rowId = Number($(this).attr("rid"));
        let colId = Number($(this).attr("cid"));
        let cellObj = db[rowId][colId];

        // if formula is there .. the cell want to be have independedn value
        if(cellObj.formula && cellObj.value!=value){
            removeFormula(cellObj);
            $("#formula").val("");
        }

        db[rowId][colId].value = value;
        // updates its children cell too
        updateChildren(cellObj);

        console.log(db);
    })

    function updateChildren(cellObj){
        let childrens = cellObj.childrens;
        console.log(childrens);
        for(let i=0;i<childrens.length;i++){
            let {rowId , colId} = getRowAndColId(childrens[i]);
            let childObj = db[rowId][colId];
            let updatedVal = solveFormula(childObj.formula);
            //update in db
            childObj.value = updatedVal;
            // update in ui
            // selector -> .cell[rid="0"][cid="1"]
            $(`.cell[rid=${rowId}][cid=${colId}]`).text(updatedVal);
            // tell all the grand childrens also to update
            // Algo used DFS ----
            updateChildren(childObj);
        }
        
    }

    
    function removeFormula(cellObj){
        cellObj.formula = "";
                for(let i=0;i<cellObj.parents.length;i++){
                    // remove me from all parents
                    let {rowId, colId} = getRowAndColId(cellObj.parents[i]);
                    let parObj = db[rowId][colId];
                    parObj = parObj.childrens.filter((child)=> child != cellObj.name);
                }
            
                cellObj.parents=[];
    }
})


function init(){
    let newDb = [];
    for(let i=0;i<100;i++){
        let row=[];
        for(let j=0;j<26;j++){
            let cellAdd = String.fromCharCode(65+j)+(i+1);
             let cellObject = {
                 name : cellAdd,
                 value : "",
                 formula : "",
                 childrens : [],
                 parents : [],
                 font : "Arial",
                 bold : false ,
                 underline : false,
                 italic : false,
                 size : "16",
                 align : "center",
                 color : "",
                 background : ""
             }

            row.push(cellObject);
        }
        newDb.push(row);  
    }
    db = newDb;
    sheetsDb.push(newDb);
    console.log(sheetsDb);
}

init();

// require(['jquery'], function($) {
//     $("document").ready(function(){

//         console.log("loaded")
//         $(".cell").on("click",function(){
//             console.log(this);
//         })
//     })
//  })