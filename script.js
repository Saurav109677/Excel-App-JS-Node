

//jquery for dom manipulation
// although document is there in js to manipulate dom but jquery gives extra freature

// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
const $ = require('jquery')

let db = [];
let lastCellVisited ;

$("document").ready(function(){

    console.log("loaded")
    $(".cell").on("click",function(){
        let rowId = Number($(this).attr("rid"))+1;
        let colId = Number($(this).attr("cid"));
        let cellAdd = String.fromCharCode(65+colId)+rowId;
        // let charColId = String.fromCharCode(65+colId) 
        // console.log(rowId , charColId);
        
        $("#address").val(cellAdd);
        $("#formula").val(db[rowId-1][colId].formula);
    })

    $("#formula").on("blur", function(){
        let formula = $(this).val();
        // console.log(formula);

        let answer = solveFormula(formula);

        let lastCellRowId = $(lastCellVisited).attr("rid");
        let lastCellColId = $(lastCellVisited).attr("cid");
        //update in db
            db[lastCellRowId][lastCellColId].value=answer+"";
            db[lastCellRowId][lastCellColId].formula=formula+"";
            console.log(db[lastCellRowId][lastCellColId]);
        //update in ui
            $(lastCellVisited).text(answer);
    })

    function solveFormula(formula){
        let fComponents = formula.split(" ");
        console.log(fComponents);
        for(let i=0;i<fComponents.length;i++){
            let fComp = fComponents[i];
            if(fComp[0]>='A' && fComp[0]<='Z'){
                let cellName = fComp;
                let {rowId,colId} = getRowAndColId(cellName);
                console.log(rowId,colId);
                let cellObj = db[rowId][colId];
                formula = formula.replace(cellName,cellObj.value);
            }
        }
        console.log(formula);
        return eval(formula);
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
        db[rowId][colId].value = value;

        console.log(lastCellVisited);
    })
})

function init(){
    for(let i=0;i<100;i++){
        let row=[];
        for(let j=0;j<26;j++){
            let cellAdd = String.fromCharCode(65+j)+(i+1);
             let cellObject = {
                 name : cellAdd,
                 value : "",
                 formula : ""
             }

            row.push(cellObject);
        }
        db.push(row);
    }
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