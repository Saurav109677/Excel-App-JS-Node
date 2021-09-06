

//jquery for dom manipulation
// although document is there in js to manipulate dom but jquery gives extra freature

// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
const $ = require('jquery')

let db = [];
let lastCellVisited ;

$("document").ready(function(){

    console.log("loaded")

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
    for(let i=0;i<100;i++){
        let row=[];
        for(let j=0;j<26;j++){
            let cellAdd = String.fromCharCode(65+j)+(i+1);
             let cellObject = {
                 name : cellAdd,
                 value : "",
                 formula : "",
                 childrens : [],
                 parents : []
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