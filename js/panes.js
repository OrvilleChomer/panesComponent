/************************************************************************************ 
    panes.js



 ************************************************************************************/

 

// *** SET UP SOME BASIC NUMERIC CONSTANTS
// *** that are available to all the code:

const orvPANE_ALIGN_TOP = 0;
const orvPANE_ALIGN_BOTTOM = 1;
const orvPANE_ALIGN_LEFT = 2;
const orvPANE_ALIGN_RIGHT = 3;
const orvPANE_ALIGN_ALL = 4;
const orvPANE_ALIGN_WINDOW = 5;   // pane transmorgafies into a window with a z index above the regular panes (1)


/*
    (1) Pane [windows] can be dragged around independently, resized, and potentially changed back into regular panes!
 */


// =========================================

 function OrvPanes(siMContainerId) {
    console.log("OrvPanes() Constructor function called")
    const pns = this;
    const masterContainer = {}; // object representing our master container
    const Q = '"';
    
    let containerPanesByIndex = [];
    let containerPanesById = [];
    let bContentPaneAdded = false;
    let allPanesByIndex = [];
    let allPanesById = [];
    let resizeBarsByIndex = [];  // June 12, 2020
    let resizeBarsById = [];

    let nNextIdNum = 1;

    let bLogResizeNumbers = false;

    let lastLeftPane;
    let lastRightPane;
    let lastTopPane;
    let lastBottomPane;

    let bALeftPaneSet = false;
    let bARightPaneSet = false;
    let bATopPaneSet = false;
    let bABottomPaneSet = false;

    let bPanesRendered = false;

    // INTERNAL NUMERIC CONSTANTS:
    const orvPANE_RESIZE_BAR_HORIZONTAL = 0;
    const orvPANE_RESIZE_BAR_VERTICAL = 1;

    const orvRESIZE_BAR_THICKNESS = 3; // 6
    const orvRESIZE_BAR_HALFTHICKNESS = Math.floor(orvRESIZE_BAR_THICKNESS / 2.0);
    const orvRESIZE_BAR_COLOR = "#D0D0D0";
    const orvRESIZE_BAR_DRAGCOLOR = "lightblue";

    const orvLEFT_MOUSE_BUTTON = 1;

    // have a pointer to the DIV that is our master container!...
    const masterContainerNd = document.getElementById(siMContainerId);

    // note that it is up to Outside code to set the width and height
    // of the master container.

    // it is up to code Inside this library based on the master container's
    // width and height to adjust its children GUI elements!

    let nResizeStartX;
    let nResizeStartY;
    let nBarStartPos;
    let nPrevPanelStartSize;
    let nCurrentPanelStartSize;

    let nPrevPanelStartLeft;
    let nPrevPanelStartRight;
    let nPrevPanelStartTop;
    let nPrevPanelStartBottom;

    let nCurrentPanelStartLeft;
    let nCurrentPanelStartRight;
    let nCurrentPanelStartTop;
    let nCurrentPanelStartBottom;

    let relatedItemsStartValues = [];

    let sActiveResizeBarId = "";
    let sResizeAlign = "";
    let activeResizeBarObj = undefined;
    let resizeBarEl;

    masterContainerNd.addEventListener("mousedown", panesMouseDown);
    masterContainerNd.addEventListener("mousemove", panesMouseMove);
    masterContainerNd.addEventListener("mouseup", panesMouseUp);

    sMContainerId = siMContainerId;

    masterContainer.width = -1;
    masterContainer.height = -1;

    const STYLE_BLOCK_ID = "orvPaneStyles";

    let styleBlockNd = document.getElementById(STYLE_BLOCK_ID);

    if (styleBlockNd === null) {
        buildPaneStyleBlock();
    } // end if

    //setupObjTypeProp(pns,"orvPanes");
    setupObjTypeProp(pns,"panes");  // June 22, 2020

    Object.defineProperties(pns, {
        "allPanesByIndex": {
            "get": function() { 
                return allPanesByIndex;
            } // end of getter code!
        },

        "logResizeNumbers": {
            "get": function() { 
                return bLogResizeNumbers;
            }, // end of getter code!
            "set": function(bValue) { 
                if (typeof bValue === "boolean") {
                    bLogResizeNumbers = bValue;
                } // end if
            } // end of setter code!
        },

        "resizeBarsByIndex": {
             "get": function() { 
                 return resizeBarsByIndex;
              } // end of getter code!

        } // end of property definition for "objType"

    }); // end of Object.defineProperties

    




   /*************************************************************************
    *  at top level, clear everything out so that we can start over...
    *************************************************************************/ 
    pns.clearPanes = function() {
        console.log("pns.clearPanes() method called")
        containerPanesByIndex = [];
        containerPanesById = [];
        allPanesByIndex = [];
        allPanesById = [];
        nNextIdNum = 1;
        bContentPaneAdded = false;
        bALeftPaneSet = false;
        bARightPaneSet = false;
        bATopPaneSet = false;
        bABottomPaneSet = false;
    } // end of clearPanes() method


   /*************************************************************************
    *************************************************************************/ 
    pns.addPane = function(params) {
        console.log("pns.addPane() method called")
        params.parentContainer = pns;
        return createPane(params);
    } // end of addPane() method for Master pane



   /*************************************************************************
    *************************************************************************/ 
    pns.doesPaneExistForId = function(sId) {
        console.log("pns.doesPaneExistForId() method called")

        if (typeof allPanesById[sId] !== "undefined") {
            return true;
        } else {
            return false;
        } // end if/else

    } // end of doesPaneExistForId() method


   /*************************************************************************
    *************************************************************************/ 
    pns.getPaneForId = function(sId) {
        console.log("pns.getPaneForId() method called")
        return allPanesById[sId];
    } // end of getPaneForId() method


   /*************************************************************************
    *************************************************************************/ 
    pns.deletePaneForId = function(sId) {
        console.log("pns.deletePaneForId() method called")
    } // end of getPaneForId() method



   /*************************************************************************
      after setting up all the panes desired for a workspace,
      you would call this to add it to the DOM.

    *************************************************************************/ 
    pns.showPanes = function() {        
        console.log("  👀👀👀👀👀 pns.showPanes() method called   👀👀👀👀")
        const sHTML = buildPanesMarkupForContainer(containerPanesByIndex);
        masterContainerNd.innerHTML = sHTML;

        //alert(sHTML)
        
        const nMax = containerPanesByIndex.length;
        console.log("--- processing "+nMax+" panes inside of container...")
        for (let n=0;n<nMax;n++) {
            const pane = containerPanesByIndex[n];
            pane.setDomRef();
        } // next n

        const nMax2 = resizeBarsByIndex.length;     
        console.log("--- processing all "+nMax2+" of the resizeBars ...")   
        for (let n2=0;n2<nMax2;n2++) {
            const resizeBar = resizeBarsByIndex[n2];
            resizeBar.setDomRef();
        } // next n2

        /********************************************************************************
           final pass through the panes to map extra resize panes

         ********************************************************************************/
        for (let n=0;n<nMax;n++) {
            const pane = containerPanesByIndex[n];
            const nMax3 = pane.relatedItemsByIndex.length;

            if (nMax3 > 0) {
                otherResizeBarMapping(pane);
            } // end if
        } // next n


        bPanesRendered = true;
    } // end of pns.showPanes() method


    /********************************************************************************
     *   Used for debugging to look at the internal state of the overall
     *   container for the panes in your browser's debugger.
     ********************************************************************************/
    pns.viewInnards = function() {

        debugger;
    } // end of pane.viewInnards() method



    // ##############################################################

    //    PRIVATE FUNCTIONS BELOW:

    // ##############################################################


    /********************************************************************************
    *  
    *  called after every mouse movement if in the process of doing
    *  a Drag on a resize bar...
    ********************************************************************************/    
    function resetAllPaneAdjustFlags() {
        const nMax = allPanesByIndex.length;

        for (let n=0;n<nMax;n++) {
            const pane = allPanesByIndex[n];
            pane.setPosAdjustFlag(false);
        } // next n
    } // end of function resetAllPaneAdjustFlags()



   /********************************************************************************
    *  
    *  Called by:
    *               .showPanes() method
    * 
    *  Builds all the HTML markup as a string for all the panes and returns it
    ********************************************************************************/    
    function buildPanesMarkupForContainer(paneContainer) {
        console.log("buildPanesMarkupForContainer() function called")
        const nMax = paneContainer.length;
        const s=[];
        const theNext = {};
        const theLast = {};

        theNext.leftPos = 0;
        theNext.rightPos = 0;
        theNext.topPos = 0;
        theNext.bottomPos = 0;

        const theNextPositions = theNext;

        theLast.leftPane = undefined;
        theLast.rightPane = undefined;
        theLast.topPane = undefined;
        theLast.bottomPane = undefined;
        theLast.pane = undefined;  // last pane regardless of which edge it is placed on

        const theLastCreatedPanes = theLast;

        for (let n=0;n<nMax;n++) {
            const pane = paneContainer[n];
            s.push(pane.genMarkup(theNextPositions, theLastCreatedPanes));
            
        } // next n

      //  alert(s.join("\n"));

        return s.join("");

    } // end of buildPanesMarkupForContainer()


   /********************************************************************************
    ********************************************************************************/
    function buildPaneStyleBlock() {
        console.log("🎻🎻 buildPaneStyleBlock() function called 🎻🎻")
        styleBlockNd = document.createElement("style");
        styleBlockNd.id = STYLE_BLOCK_ID;
        const s = [];

        const PANE_BACKGROUND_COLOR = "#F3F3F3";
        const RESIZE_BAR_COLOR = "";
        const RESIZE_BAR_COLOR_MOUSEDOWN = "";

        // defines outer edge of whole pane
        s.push(".orvPane {");
        s.push("  box-sizing: border-box;");
        s.push("  position:absolute;");
        s.push("  overflow:hidden;");
        s.push("  border:solid gray 1px;");  // temp ???
        s.push("  background:"+PANE_BACKGROUND_COLOR+";");
        s.push("  margin:0px;");
        s.push(buildPaneStyleUnselectable());
        s.push("}");

        

        // div where Content or other panes would be placed   
        s.push(".orvPaneContainer {");
        s.push("  box-sizing: border-box;");
        s.push("  position:absolute;");
        s.push("  overflow:hidden;");
        s.push("  margin:0px;");
        s.push("  padding:0px;");
        s.push("  left:3px;");
        s.push("  right:3px;");
        s.push("  top:23px;"); // 3px
        s.push("  bottom:3px;");
        s.push("  border:solid gray .5px;");  // temp ???
        s.push("}");



        s.push(".orvPaneTitlebar {");
        s.push("  box-sizing: border-box;");
        s.push("  overflow:hidden;");
        s.push("  position:absolute;");
        s.push("  background: darkblue;");
        s.push("  left:3px;");
        s.push("  right:3px;");
        s.push("  top:3px;");
        s.push("  height:18px;");
        s.push(buildPaneStyleUnselectable());
        s.push("}");

        s.push(".orvPaneTitlebarCaption {");
        s.push("  box-sizing: border-box;");
        s.push("  overflow:hidden;");
        s.push("  position:absolute;");
        s.push("  top:0px;");
        s.push("  margin:0px;");
        s.push("  padding:0px;");
        s.push("  left:5px;");
        s.push("  right:36px;");
        //s.push("  background: pink;");
        s.push("  color: white;");
        s.push("  font-family: tahoma;");
        s.push("  font-size: 14px;");
        s.push("  font-weight: bold;");
        s.push("  text-height: 18px;");
        s.push("}");

        s.push(".orvPaneWindow {");
        s.push("  box-sizing: border-box;");
        s.push(buildPaneStyleUnselectable());
        s.push("}");

        s.push(".orvPaneWindowTitlebar {");
        s.push("  box-sizing: border-box;");
        s.push(buildPaneStyleUnselectable());
        s.push("}");

        s.push(".orvPaneWindowTitlebarCaption {");
        s.push("  box-sizing: border-box;");
        s.push("}");

        s.push(".orvPaneResizeToolbarHorizontal {");
        s.push("  box-sizing: border-box;");
        s.push("  position:absolute;");
        s.push("  left:0px;");
        s.push("  overflow:hidden;");
        s.push("  height:"+orvRESIZE_BAR_THICKNESS+"px;");
        s.push("  background:"+orvRESIZE_BAR_COLOR+";");
        s.push("  cursor:row-resize;");
        s.push(buildPaneStyleUnselectable());
        
        
        s.push("  z-index:10;"); // if any errors in calcs, I want to stand out from panes
        s.push("}");

        s.push(".orvPaneResizeToolbarVertical {");
        s.push("  position:absolute;");
        s.push("  top:0px;");
        s.push("  box-sizing: border-box;");
        s.push("  overflow:hidden;");
        s.push("  width:"+orvRESIZE_BAR_THICKNESS+"px;");
        s.push("  background:"+orvRESIZE_BAR_COLOR+";");
        s.push("  cursor:col-resize;");
        s.push(buildPaneStyleUnselectable());
        s.push("  z-index:10;"); // if any errors in calcs, I want to stand out from panes
        s.push("}");

        styleBlockNd.innerHTML = s.join("");
        document.body.appendChild(styleBlockNd);
    } // end of function buildPaneStyleBlock()


   /********************************************************************************
    ********************************************************************************/    
    function buildPaneStyleUnselectable() {
        const s=[];
        s.push("user-select: none;");
        s.push("-moz-user-select: none;");
        s.push("-khtml-user-select: none;");
        s.push("-webkit-user-select: none;");
        s.push("-o-user-select: none;");
        
        return s.join("");
    } // end of function buildPaneStyleUnselectable()



  /********************************************************************************
   * 
   *  Called from:   pns.showPanes() method
   * 
   ********************************************************************************/
   function otherResizeBarMapping(pane) {
       console.log("😜😜otherResizeBarMapping()  called 😜😜")
        const nMax = pane.relatedItemsByIndex.length;
        for (let n=0;n<nMax;n++) {
            const pane2 = pane.relatedItemsByIndex[n];
            const resizeBarsByIndex = pane2.resizeBarsByIndex;
            const nMax2 = resizeBarsByIndex.length;
            
            for (let n2=0;n2<nMax2;n2++) {
                const resizeBar = resizeBarsByIndex[n2];

                if (pane2.align === resizeBar.align) {
                    console.log("possible resize bar found!")

                    const previousPane = resizeBar.previousPane;
                    const currentPane = resizeBar.currentPane;

                    if (resizeBar.align === "left" || resizeBar.align === "right") {
                        if (previousPane.left === pane2.left || previousPane.right === pane2.right) {
                            resizeBar.addAnotherPane(pane2, "prev", previousPane);
                            console.log("another pane added based on previousPane value")
                        } // end if

                        if (currentPane.left === pane2.left || currentPane.right === pane2.right) {
                            resizeBar.addAnotherPane(pane2, "curr", currentPane);
                            console.log("another pane added based on currentPane value")
                        } // end if
                    } // end if

                    if (resizeBar.align === "top" || resizeBar.align === "bottom") {
                        if (previousPane.top === pane2.top || previousPane.bottom === pane2.bottom) {
                            resizeBar.addAnotherPane(pane2, "prev", previousPane);
                            console.log("another pane added based on previousPane value")
                        } // end if

                        if (currentPane.top === pane2.top || currentPane.bottom === pane2.bottom) {
                            resizeBar.addAnotherPane(pane2, "curr", currentPane);
                            console.log("another pane added based on currentPane value")
                        } // end if
                    } // end if
                } // end if

            } // next n2

        } // next n
   } // end of function otherResizeBarMapping()



   /********************************************************************************
    ********************************************************************************/
    function getNextId() {
        const nNewId = nNextIdNum;
        nNextIdNum++;
        
        return "orvPaneEl"+nNewId;

    } // end of function getNextIdNum()


   /********************************************************************************
    ********************************************************************************/
    function setupObjTypeProp(obj,sObjTypeValue) {
        Object.defineProperties(obj, {
            "objType": {
                 "get": function() { 
                     return sObjTypeValue+"";
                  } // end of getter code!

            } // end of property definition for "objType"

        }); // end of Object.defineProperties
    } // end of function setupObjTypeProp()
    

   /********************************************************************************
     create and return a Pane object...
    ********************************************************************************/ 
    function createPane(params) {
        console.log("🌞🌞🌞createPane() function called 🌞🌞🌞")
        const orvWINDOW_STATE_NORMAL = 0;
        const orvWINDOW_STATE_MAXIMIZED = 1;
        const orvWINDOW_STATE_MINIMIZED = 2;

        function CreatePane(params) {
            console.log("🌜🌜🌜CreatePane() Constructor called 🌜🌜🌜")
            const pane = this;
            const sPaneId = getNextId();
            let paneAlignment = getVal(params,"paneAlignment",orvPANE_ALIGN_LEFT);
            let bViewportPane = getVal(params,"viewPortPane",false);
            let bPaneLocked = getVal(params,"paneLocked",false);
            let bShowTitleBar = getVal(params,"showTitleBar",true);
            let bAllowWindowToggle = getVal(params,"allowWindowToggle",true); // can user toggle back and forth between window and pane...
            let sCaption = getVal(params,"caption","Pane "+(allPanesByIndex.length+1));
            let nMinWidth = getVal(params,"minWidth",40);
            let nMinHeight = getVal(params,"minHeight",40);
            let nCurrentWidth = getVal(params,"width",400);
            let nCurrentHeight = getVal(params,"height",400);
            let sOverflow = getVal(params,"overflow","auto");
            
            let bPosAdjusted = false;

            // related panes and resize bars
            let relatedItemsByIndex = []; 
            let relatedItemsById = []; 

            let sPaneContent = getVal(params,"paneContent","");

            // window specific GUI settings
            let bMaxRestoreBtn = getVal(params,"showMaxRestoreBtn",true);
            let bMinBtn = getVal(params,"showMinBtn",true);


            let bHelpBtn = getVal(params,"showHelpBtn",false);
            let bCloseBtn = getVal(params,"showCloseBtn",true);

            let childPanesByIndex = [];
            let childPanesById = [];

            // positioning:
            let nPaneLeft = -1;
            let nPaneRight = -1;
            let nPaneTop = -1;
            let nPaneBottom = -1;
            let nWindowLeft = -1;
            let nWindowTop = -1;
            
            let paneResizeBarsByIndex = [];
            let paneResizeBarsById = [];

      
            let nLastCurrentWidth = nCurrentWidth;
            let nLastCurrentHeight = nCurrentHeight;
            let nLastPaneLeft = nPaneLeft;
            let nLastPaneRight = nPaneRight;
            let nLastPaneTop = nPaneTop;
            let nLastPaneBottom = nPaneBottom;

            // ref objects:
            let parentContainer = getVal(params,"parentContainer",masterContainer);
            

            // ref to pane DIV that is part of DOM (when it is finally generated)
            let paneNd,paneContentNd;

            console.log("sCaption='"+sCaption+"'   ... sPaneId: '"+sPaneId+"'");

            // define some read-only properties:
            console.log("about to define custom getters.")
            Object.defineProperties(pane, {
                //
                "minWidth": {
                    "get": function() { 
                        return nMinWidth;
                    } // end of getter code!
                },  // end of getter code!

                "width": {
                    "get": function() { 
                        return nCurrentWidth;
                    } // end of getter code!
                },

                "align": {
                    "get": function() { 
                        if (paneAlignment === orvPANE_ALIGN_LEFT) return "left";
                        if (paneAlignment === orvPANE_ALIGN_RIGHT) return "right";
                        if (paneAlignment === orvPANE_ALIGN_TOP) return "top";
                        if (paneAlignment === orvPANE_ALIGN_BOTTOM) return "bottom";
                        if (paneAlignment === orvPANE_ALIGN_ALL) return "all";
                        return "???";
                    } // end of getter code!
                },

                "id": {
                    "get": function() { 
                        return sPaneId;
                    } // end of getter code!
                },

                "minHeight": {
                    "get": function() { 
                        return nMinHeight;
                    } // end of getter code!
                },  // end of getter code!

                "height": {
                    "get": function() { 
                        return nCurrentHeight;
                    } // end of getter code!
                }, // end of getter code!

                "resizeBarsByIndex": {
                    "get": function() { 
                        return paneResizeBarsByIndex;
                    } // end of getter code!
                },

                "parentContainer": {
                    "get": function() { 
                        return parentContainer;
                    } // end of getter code!
                },

                "relatedItemsByIndex": {
                    "get": function() { 
                        return relatedItemsByIndex;
                    } // end of getter code!
                },


                "top": {
                    "get": function() { 
                        return nPaneTop;
                    } // end of getter code!
                },  

                "bottom": {
                    "get": function() { 
                        return nPaneBottom;
                    } // end of getter code!
                },

                "left": {
                    "get": function() { 
                        return nPaneLeft;
                    } // end of getter code!
                },  

                "right": {
                    "get": function() { 
                        return nPaneRight;
                    } // end of getter code!
                }
                
            }); // end of Object.defineProperties
            console.log("completed defining custom getters.")



           /********************************************************************************
            *  
	        ********************************************************************************/
            pane.setPosAdjustFlag = function(bNewValue) {
                bPosAdjusted = bNewValue;
            } // end of pane.setPosAdjustFlag()  method



           /********************************************************************************
            *  add a child pane to the current pane...
	        ********************************************************************************/
            pane.addPane = function(params) {
                console.log(" 🍼🍼  pane.addPane() method called to add a Child pane!!  🍼🍼")
                params.parentContainer = pane;

                return createPane(params);
            } // end of addPane() method (on pane object!)



           /********************************************************************************
            *  addContent is NOT used for panes that already have child panes.
	        ********************************************************************************/
            pane.addContent = function(params) {
                console.log(" 🍔 pane.addContent() method called")
                sPaneContent = getVal(params,"paneContent","");

                if (bPanesRendered) {
                    paneContentNd.innerHTML = sPaneContent;
                } // end if

            } // end of pane.addContent() method (for pane object only)



           /********************************************************************************
            *  
            *   called by:    pane.genMarkup()
            * 
            *   Note:
            *   -----
            *   The contents of the internal variable:   relatedItemsByIndex   can be access from the {pane}
            *   object via the:   relatedItemsByIndex property of the pane!
            * 
	        ********************************************************************************/            
            pane.addRelatedPane = function(relatedPane) {
                console.log(" ⛽ pane.addRelatedPane() called")
                if (relatedPane.id !== sPaneId) {
                    if (typeof relatedItemsById[relatedPane.id] === "undefined") {
                        relatedItemsById[relatedPane.id] = relatedPane;
                        relatedItemsByIndex.push(relatedPane);
                    } // end if
                } // end if

            } // end of pane.addRelatedPane() method


           /********************************************************************************
            *  lets pane know about any resize bars that belong to it
            *  called near the end of the CreateResizeBar() function
            *  for the current pane and the previous pane.
            * 
            *  This is so each pane "knows" what resize bars are associated with it!
            * 
            *   Called by:   CreateResizeBar()   Constructor
            * 
	        ********************************************************************************/
            pane.addResizeBarRef = function(rb) {
                console.log("   🎭🎭 pane.addResizeBarRef() method called  🎭🎭")

                if (typeof paneResizeBarsById[rb.id] === "undefined") {
                    paneResizeBarsById[rb.id] = rb;
                    paneResizeBarsByIndex.push(rb);
                } // end if

            } // end of addResizeBarRef() method


           /********************************************************************************
            *   Build HTML markup for this specific pane object
            * 
            *   Called by:
            *            buildPanesMarkupForContainer()
	        ********************************************************************************/            
            pane.genMarkup = function(theNextPositions, theLastCreatedPanes) {
                console.log("⛄ pane.genMarkup() method called ⛄")
                const theNext = theNextPositions;
                const theLast = theLastCreatedPanes;
                const s1=[]; // HTML for any resize bar
                const s2=[]; // HTML for the current pane

                if (typeof theLast.pane !== "undefined" && sPaneId !== theLast.pane.id) {
                    if (typeof relatedItemsById[theLast.pane.id] === "undefined") {
                        relatedItemsById[theLast.pane.id] = theLast.pane;
                        relatedItemsByIndex.push(theLast.pane);
                        theLast.pane.addRelatedPane(pane); // circular referencing :D
                    } // end if
                } // end if

                s2.push("<div class='orvPane' ");

                s2.push("id="+Q);
                s2.push(sPaneId);
                s2.push(Q);

                s2.push(" style="+Q);
    
                switch (paneAlignment) {
                    case orvPANE_ALIGN_TOP:
                        console.log("📮creating a pane's HTML markup to align to the Top")
                        nPaneTop = theNext.topPos;
                        nPaneLeft = theNext.leftPos;
                        nPaneRight = theNext.rightPos;

                        nLastPaneTop = nPaneTop;
                        nLastPaneLeft = nPaneLeft;
                        nLastPaneRight = nPaneRight;

                        s2.push("top:"+(nPaneTop)+"px;");
                        s2.push("height:"+(nCurrentHeight)+"px;");      // ***                     
                        s2.push("left:"+(nPaneLeft)+"px;");                        
                        s2.push("right:"+(nPaneRight)+"px;");

                        if (theNext.topPos>0) {
                            console.log("about to call: createResizeBar()")
                            const rb = createResizeBar({align: "top", previousPane: theLast.topPane, currentPane: pane, pos: theNext.topPos});
                            s1.push(rb.getHtmlMarkup());
                            // search for:   resizeBar.getHtmlMarkup
                        } // end if

                        theNext.topPos = theNext.topPos + orvRESIZE_BAR_THICKNESS;
                        theNext.topPos = theNext.topPos + nCurrentHeight;
                        theLast.topPane = pane;                        
                        break;
                    case orvPANE_ALIGN_BOTTOM:
                        console.log("📮creating a pane's HTML markup to align to the Bottom")
                        nPaneBottom = theNext.bottomPos;
                        nPaneLeft = theNext.leftPos;
                        nPaneRight = theNext.rightPos;

                        nLastPaneBottom = nPaneBottom;
                        nLastPaneLeft = nPaneLeft;
                        nLastPaneRight = nPaneRight;

                        s2.push("bottom:"+(nPaneBottom)+"px;");
                        s2.push("height:"+(nCurrentHeight)+"px;");   // ***
                        s2.push("left:"+(nPaneLeft)+"px;");
                        s2.push("right:"+(nPaneRight)+"px;");

                        if (theNext.bottomPos>0) {
                            console.log("about to call: createResizeBar()")
                            const rb = createResizeBar({align: "bottom", previousPane: theLast.bottomPane, currentPane: pane, pos: theNext.bottomPos});
                            s1.push(rb.getHtmlMarkup());
                            theNext.bottomPos = theNext.bottomPos + orvRESIZE_BAR_THICKNESS;
                        } // end if

                        theNext.bottomPos = theNext.bottomPos + nCurrentHeight;
                        theLast.bottomPane = pane;
                        break;
                    case orvPANE_ALIGN_LEFT:
                        console.log("📮creating a pane's HTML markup to align to the Left")
                        nPaneLeft = theNext.leftPos;
                        nPaneTop = theNext.topPos;
                        nPaneBottom = theNext.bottomPos;

                        nLastPaneLeft = nPaneLeft;
                        nLastPaneTop = nPaneTop;
                        nLastPaneBottom = nPaneBottom;

                        s2.push("left:"+(nPaneLeft)+"px;");
                        s2.push("width:"+(nCurrentWidth)+"px;"); // ***
                        s2.push("top:"+(nPaneTop)+"px;");                        
                        s2.push("bottom:"+(nPaneBottom)+"px;");

                        if (theNext.leftPos>0) {
                            console.log("about to call: createResizeBar()")
                            const rb = createResizeBar({align: "left", previousPane: theLast.leftPane, currentPane: pane, pos: theNext.leftPos});
                            s1.push(rb.getHtmlMarkup());
                        } // end if

                        theNext.leftPos = theNext.leftPos + nCurrentWidth;
                        theLast.leftPane = pane;
                        break;
                    case orvPANE_ALIGN_RIGHT:
                        console.log("📮creating a pane's HTML markup to align to the Right")
                        nPaneRight = theNext.rightPos;
                        nPaneTop = theNext.topPos;
                        nPaneBottom = theNext.bottomPos;

                        nLastPaneRight = nPaneRight;
                        nLastPaneTop = nPaneTop;
                        nLastPaneBottom = nPaneBottom;

                        s2.push("right:"+(nPaneRight)+"px;");
                        s2.push("width:"+(nCurrentWidth)+"px;");     // ***
                        s2.push("top:"+(nPaneTop)+"px;");                        
                        s2.push("bottom:"+(theNext.bottomPos)+"px;");

                        if (theNext.rightPos>0) {
                            console.log("about to call: createResizeBar()")
                            const rb = createResizeBar({align: "right", previousPane: theLast.rightPane, currentPane: pane, pos: theNext.rightPos});
                            s1.push(rb.getHtmlMarkup());
                            theNext.rightPos = theNext.rightPos + orvRESIZE_BAR_THICKNESS;
                        } // end if

                        theNext.rightPos = theNext.rightPos + nCurrentWidth;
                        theLast.rightPane = pane;
                        break;
                    case orvPANE_ALIGN_ALL:
                        console.log("📮creating a pane's HTML markup to align to All sides")
                        // basically this case is done for the viewport pane...
                        nPaneTop = theNext.topPos;
                        nPaneBottom = theNext.bottomPos;
                        nPaneLeft = theNext.leftPos;
                        nPaneRight = theNext.rightPos;

                        nLastPaneTop = nPaneTop;
                        nLastPaneBottom = nPaneBottom;
                        nLastPaneLeft = nPaneLeft;
                        nLastPaneRight = nPaneRight;

                        s2.push("top:"+(nPaneTop)+"px;");                        
                        s2.push("bottom:"+(nPaneBottom)+"px;");
                        s2.push("left:"+(nPaneLeft)+"px;");
                        s2.push("right:"+(nPaneRight)+"px;");

                        if (theNext.topPos>0) {
                            console.log("about to call: createResizeBar()")
                            const rb = createResizeBar({align: "top", previousPane: theLast.topPane, currentPane: pane, pos: theNext.topPos});
                            s1.push(rb.getHtmlMarkup());
                            theNext.topPos = theNext.topPos + orvRESIZE_BAR_THICKNESS;
                        } // end if

                        if (theNext.bottomPos>0) {
                            const rb = createResizeBar({align: "bottom", previousPane: theLast.bottomPane, currentPane: pane, pos: theNext.bottomPos});
                            s1.push(rb.getHtmlMarkup());
                            theNext.bottomPos = theNext.bottomPos + orvRESIZE_BAR_THICKNESS;
                        } // end if

                        if (theNext.leftPos>0) {
                            const rb = createResizeBar({align: "left", previousPane: theLast.leftPane, currentPane: pane, pos: theNext.leftPos});
                            s1.push(rb.getHtmlMarkup());
                            theNext.leftPos = theNext.leftPos + orvRESIZE_BAR_THICKNESS;
                        } // end if

                        if (theNext.rightPos>0) {
                            const rb = createResizeBar({align: "right", previousPane: theLast.rightPane, currentPane: pane, pos: theNext.rightPos});
                            s1.push(rb.getHtmlMarkup());
                            theNext.rightPos = theNext.rightPos + orvRESIZE_BAR_THICKNESS;
                        } // end if

                        break;
                    case orvPANE_ALIGN_WINDOW:
                        console.log("creating HTML markup for a free floating 'window'.")
                        // for a free-floating child window...
                        s2.push("TBD!")
                        break;
                    default:
                        console.log("Should NOT have gotten here!");
                        alert("Should NOT have gotten here!");
                } // end switch()
    

                s2.push(Q); // closing quote for style attribute's value
    
                s2.push(">"); // opening div tag for 'orvPane' class
                
                if (bShowTitleBar) {
                    s2.push("<div class='orvPaneTitlebar' ");
                    s2.push(">");

                    s2.push("<div class='orvPaneTitlebarCaption' ");
                    s2.push(">");

                    //sCaption
                    s2.push(sCaption);

                    s2.push("</div>"); // closing div 'orvPaneTitlebarCaption'

                    s2.push("</div>"); // closing div 'orvPaneTitlebar'
                } // end if

                s2.push("<div class='orvPaneContainer' ");
                s2.push("style="+Q);
                s2.push("overflow:"+sOverflow+";");

                if (!bShowTitleBar) {                    
                    s2.push("top:3px;");                    
                } // end if

                s2.push(Q);
                s2.push(" ");

                s2.push("id="+Q);
                s2.push(sPaneId+"_content");
                s2.push(Q);

                s2.push(">"); // opening div tag for 'orvPaneContainer' class

                s2.push(sPaneContent); // markup inside the pane
                
                s2.push("</div>"); // closing div tag for 'orvPaneContainer' class

                s2.push("</div>"); // closing div tag for 'orvPane' class

                theLast.pane = pane;

                /*
                   take resize bar markup, add the pane markup to it, and return that string!
                 */
                return s1.join("")+s2.join("");
                
            } // end of pane.genMarkup() method




            /********************************************************************************
             * 
             *  pane.setDomRef() method
             * 
             *  Called by:    pns.showPanes()
             * 
             *  Lets simple JavaScript "pane" object know about the DOM elements that it is 
             *  managing.
             * 
             *  - One is for the overall {pane} panel itself.   paneNd
             *  - The other is for the element that the pane's "content" is placed in:  paneContentNd
             * 
	         ********************************************************************************/
            pane.setDomRef = function() {
                console.log("   🤑 pane.setDomRef() method called 🤑 - sPaneId: '"+sPaneId+"'")
                paneNd = document.getElementById(sPaneId)
                paneContentNd = document.getElementById(sPaneId+"_content")

            } // end of setDomRef() method



            /********************************************************************************
             *   
             *   Called from:    resizeBarDragMove()
             * 
             *   Sets the panel height in the DOM of the current pane.
	         ********************************************************************************/
            pane.setNewHeight = function(nNewHeight) {
                let sNewHeight = "";

                if (bLogResizeNumbers) {
                    sNewHeight = "   nNewHeight:"+nNewHeight;
                } // end if

                console.log("pane.setNewHeight() called."+sNewHeight)
                console.log("  😳 pane.id: '"+sPaneId+"'")
                console.log("   😳 nLastCurrentHeight (before): "+nLastCurrentHeight)


          //      if (bPosAdjusted) return;

                if (nNewHeight < nMinHeight) {                    
                    nNewHeight = nMinHeight;
                    if (bLogResizeNumbers) {
                        console.log("❗nNewHeight < nMinHeight ("+nMinHeight+") set to nMinHeight!")
                    } // end if
                } // end if

                nLastCurrentHeight = nCurrentHeight;
                console.log("  😳 nLastCurrentHeight (after): "+nLastCurrentHeight)
                nCurrentHeight = nNewHeight;
                paneNd.style.height = (nCurrentHeight)+"px";
                
            } // end of pane.setNewHeight() method


            /********************************************************************************
             * 
             *   Called from:   resizeBarDragMove()
             * 
	         ********************************************************************************/
            pane.setNewPos = function(nNewPos, sAlign) {
                let sNewPos = "";

                if (bLogResizeNumbers) {
                    sNewPos = "   nNewPos:"+nNewPos;
                } // end if

                console.log("pane.setNewPos() called.   sAlign: '"+sAlign+"' "+sNewPos)
                console.log("   😳 pane.id: '"+sPaneId+"'")
                

             //   if (bPosAdjusted) return;

                if (sAlign === "left") {
                    nLastPaneLeft = nPaneLeft;
                    nPaneLeft = nNewPos;
                } // end if

                if (sAlign === "right") {
                    nLastPaneRight = nPaneRight;
                    nPaneRight = nNewPos;
                } // end if

                if (sAlign === "top") {
                    nLastPaneTop = nPaneTop;
                    nPaneTop = nNewPos;
                } // end if

                if (sAlign === "bottom") {
                    nLastPaneBottom = nPaneBottom;
                    nPaneBottom = nNewPos;
                } // end if

                paneNd.style[sAlign] = (nNewPos)+"px";
                
                console.log("have set:   paneNd.style."+sAlign+" = '"+(nNewPos)+"px'")
            } // end of pane.setNewPos() method



            /********************************************************************************
             * 
             *   Called by:   resizeBarDragMove()
             * 
             *   Sets the panel width of the current pane in the DOM
             * 
	         ********************************************************************************/
            pane.setNewWidth = function(nNewWidth) {
                let sNewWidth = "";

                if (bLogResizeNumbers) {
                    sNewWidth = "   nNewWidth:"+nNewWidth;
                } // end if

                console.log("pane.setNewWidth() called."+sNewWidth)
                console.log("   😳 pane.id: '"+sPaneId+"'")
                console.log("   😳 nLastCurrentWidth (before): "+nLastCurrentWidth)

             //   if (bPosAdjusted) return;

                if (nNewWidth < nMinWidth) {                    
                    nNewWidth = nMinWidth;
                    if (bLogResizeNumbers) {
                        console.log("❗nNewWidth < nMinWidth ("+nMinWidth+") set to nMinWidth!")
                    } // end if
                } // end if

                nLastCurrentWidth = nCurrentWidth;
                console.log("   😳 nLastCurrentWidth (after): "+nLastCurrentWidth)

                nCurrentWidth = nNewWidth;
                paneNd.style.width = (nCurrentWidth)+"px";
                
            } // end of pane.setNewWidth() method


            /********************************************************************************
             *   Used for debugging to look at the internal state of a "pane"
             *   in your browser's debugger
	         ********************************************************************************/
            pane.viewInnards = function() {

                debugger;
            } // end of pane.viewInnards() method


            // *** Add new pane to appropriate arrays...
            containerPanesByIndex.push(pane);
            allPanesByIndex.push(pane);
            allPanesById[pane.id] = pane;  // June 22, 2020
            
            switch (paneAlignment) {
                case orvPANE_ALIGN_TOP:
                    bATopPaneSet = true;
                    break;
                case orvPANE_ALIGN_BOTTOM:
                    bABottomPaneSet = true;
                    break;
                case orvPANE_ALIGN_LEFT:
                    bALeftPaneSet = true;
                    break;
                case orvPANE_ALIGN_RIGHT:
                    bARightPaneSet = true;
                    break;
                case orvPANE_ALIGN_ALL:
                    ATopPaneSet = true;
                    bABottomPaneSet = true;
                    bALeftPaneSet = true;
                    bARightPaneSet = true;
                    break;
                case orvPANE_ALIGN_WINDOW:                
                    break;
            } // end switch (paneAlignment) 

        } // end of constructor function CreatePane()


        

        const pn = new CreatePane(params); // calling constructor defined above
        
        setupObjTypeProp(pn,"pane");
        return pn; // returns our 'pane' object out to the 'world' :)

    } // end of function createPane()


   /********************************************************************************
    * 
    *   Called multiple times by:   pane.genMarkup()
    * 
	********************************************************************************/
    function createResizeBar(params) {
        console.log("createResizeBar() called")

       /********************************************************************************
        *    
        *    Called by the createResizeBar() function to return an encapsulated
        *    {resizeBar} JavaScript object.
	    ********************************************************************************/
        function CreateResizeBar(params) {
            console.log("CreateResizeBar() constructor called")
            const resizeBar = this;
            
            const sResizeBarId = getNextId();

            let sAlign = getVal(params,"align","left");
            let sResizeClass;
            let sStyle = "";
            let resizeBarNd; // DOM node of resize bar

            let relatedItemsByIndex = [];
            let relatedItemsById = [];

            let extraPanesByIndex = [];
            let extraPanesById = [];
            let extraPanesByPrevCurr = [];

            extraPanesByPrevCurr["curr"] = [];
            extraPanesByPrevCurr["prev"] = [];


            // reference to pane objects on either side of resize bar:
            let previousPane = params.previousPane;
            let currentPane = params.currentPane;
            let nPos = params.pos;

            console.log("about to associate the current and previous Panes with this resize bar...")
            addRelationships(previousPane, currentPane.id)
            addRelationships(currentPane, previousPane.id)

            // initial values until overridden...
            let nMinPos = 0;
            let nMaxPos = window.innerWidth - orvRESIZE_BAR_THICKNESS;

            
            // #resize_prop_def
            // Define resize bar properties:
            Object.defineProperties(resizeBar, {
                //
                "style": {
                    "get": function() { 
                        return sStyle;
                    } // end of getter code!
                },  // end of overall 'style' property block!

                "align": {
                    "get": function() { 
                        return sAlign;
                    } // end of getter code!
                },

                "id": {
                    "get": function() { 
                        return sResizeBarId;
                    } // end of getter code!
                },


                "resizeClass": {
                    "get": function() { 
                        return sResizeClass;
                    } // end of getter code!
                },  

                "currPos": {
                    "get": function() { 
                        return 0;
                    } // end of getter code!
                },

                "minPos": {
                    "get": function() { 
                        return nMinPos;
                    } // end of getter code!
                },  

                "maxPos": {
                    "get": function() { 
                        return nMaxPos;
                    } // end of getter code!
                },

                "extraPanesForCurrent": {
                    "get": function() { 
                        return extraPanesByPrevCurr["curr"];
                    } // end of getter code!
                },

                "extraPanesForPrevious": {
                    "get": function() { 
                        return extraPanesByPrevCurr["prev"];
                    } // end of getter code!
                },

                "previousPane": {
                    "get": function() { 
                        return previousPane;
                    } // end of getter code!
                }, 
                
                // the property:   "objType" is set up elsewhere!
                

                "currentPane": {
                    "get": function() { 
                        return currentPane;
                    } // end of getter code!
                }
                
            }); // end of Object.defineProperties



            if (sAlign=== "left" || sAlign=== "right") {
                console.log("detected need for vertical resize bar")
                sResizeClass = "orvPaneResizeToolbarVertical";                
                sStyle = sStyle + posStyle(previousPane, sAlign);                

            } // end if

            if (sAlign=== "top" || sAlign=== "bottom") {
                console.log("detected need for horizontal resize bar")
                sResizeClass = "orvPaneResizeToolbarHorizontal";
                sStyle = sStyle + posStyle(previousPane, sAlign);
                //debugger
                
            } // end if

            

            /********************************************************************************
             * add pane relationships to this {resize bar} based on alignment of neighboring 
             * panes
             * 
             *   Called from:    CreateResizeBar()
             * 
	         ********************************************************************************/
            function addRelationships(refPane, sOtherPaneId) {
                console.log("  🍭 addRelationships() called.   Other pane.id='"+sOtherPaneId+"' refPane.id='"+refPane.id+"' 🍭")
                const relatedItemsByIndex2 = refPane.relatedItemsByIndex;
                const nMax = relatedItemsByIndex2.length;
                
                for (let n=0;n<nMax;n++) {
                    const relatedItem = relatedItemsByIndex2[n];

                    if (relatedItem.id !==previousPane.id && relatedItem.id !==currentPane.id) {
                        if (sAlign=== "left" || sAlign=== "right") {
                            if (relatedItem.align === "top" || relatedItem.align=== "bottom") {
                                if (typeof relatedItemsById[relatedItem.id] === "undefined") {
                                    relatedItemsById[relatedItem.id] = relatedItem;
                                    relatedItemsByIndex.push(relatedItem);
                                } // end if
                            } // end if
                        } // end if
        
                        if (sAlign=== "top" || sAlign=== "bottom") {
                            if (relatedItem.align=== "left" || relatedItem.align=== "right") {
                                if (typeof relatedItemsById[relatedItem.id] === "undefined") {
                                    relatedItemsById[relatedItem.id] = relatedItem;
                                    relatedItemsByIndex.push(relatedItem);
                                } // end if
                            } // end if
                        } // end if
                    } // end if
                } // next n

            } // end of function addRelationships()




            console.log("sStyle = '"+sStyle+"'")
          //  debugger


            /********************************************************************************
             * 
             * 
             *    Search for:  "#resize_prop_def"
	         ********************************************************************************/
            resizeBar.addAnotherPane = function(newPane, sPrevCurrent, matchupPane) {
                console.log("🧀🧀 resizeBar.addAnotherPane() method called 🧀🧀")

                if (typeof extraPanesById[newPane.id] === "undefined") {
                    const extraPaneContainer = {};

                    extraPaneContainer.id = newPane.id;
                    extraPaneContainer.pane = newPane;
                    extraPaneContainer.prevCurrent = sPrevCurrent; // matched up with what pane... the previous or current
                    extraPaneContainer.matchupPane = matchupPane;

                    extraPanesById[newPane.id] = extraPaneContainer;
                    extraPanesByIndex.push(extraPaneContainer);
                    console.log("**** Extra pane was added.  🌴🌴🌴")

                    if (typeof extraPanesByPrevCurr[sPrevCurrent] === "undefined") {
                        extraPanesByPrevCurr[sPrevCurrent] = [];
                    } // end if

                    let prevCurrLst = extraPanesByPrevCurr[sPrevCurrent];
                    prevCurrLst.push(extraPaneContainer);
                    console.log("**** Added to extraPanesByPrevCurr list for: '"+sPrevCurrent+"'.  🌴🌴🌴")
                } // end if
            } // end of resizeBar.addAnotherPane() method


           /********************************************************************************
            * 
            *  Generates HTML markup needed to produce a resize bar on the web page.
            * 
            *  Called multiple times from:   pane.genMarkup()
            * 
	        ********************************************************************************/
            resizeBar.getHtmlMarkup = function() {
                console.log("🤔🤔resizeBar.getHtmlMarkup() method called")
                const s = [];

                s.push("<div class='");
                s.push(sResizeClass);
                s.push("' ");

                s.push("id="+Q);
                s.push(sResizeBarId);
                s.push(Q);

                s.push("style=");
                s.push(Q);
                s.push(sStyle);
                s.push(Q);
                s.push(">"); // end of opening tag

                s.push("</div>"); // closing tag

                return s.join("");
            } // end of getHtmlMarkup method for resize bar


            /********************************************************************************
             * 
             *    called by:    pns.showPanes()
             * 
             *    Let plain JavaScript resize bar object know about the 
             *    DOM element that it is working with!
	         ********************************************************************************/
            resizeBar.setDomRef = function() {
                console.log("💈 resizeBar.setDomRef() method called 💈")
                resizeBarNd = document.getElementById(sResizeBarId)
            } // end of setDomRef() method


            // global references to the resize bars are added to:
            resizeBarsByIndex.push(resizeBar);
            resizeBarsById[sResizeBarId] = resizeBar;

            // resize bar references for specific related panes
            previousPane.addResizeBarRef(resizeBar);
            currentPane.addResizeBarRef(resizeBar);

        } // end of function CreateResizeBar()


        const rb = new CreateResizeBar(params); // calls Constructor defined above.
        setupObjTypeProp(rb,"resizeBar");
        
        return rb;
    } // end of Constructor function createResizeBar()


    /********************************************************************************
     * 
	 ********************************************************************************/
    function panesMouseDown(evt) {
        console.log("panesMouseDown")
        const el = evt.srcElement;
        console.log("  id="+el.id)
        console.log("  className="+el.className)

        if (el.className === "orvPaneResizeToolbarVertical" || el.className === "orvPaneResizeToolbarHorizontal") {
            resizeBarDragBegin(evt);
        } // end if
    } // end of function panesMouseDown()


    /********************************************************************************
     * 
     *   Called by:    masterContainerNd.addEventListener('mousemove')
	 ********************************************************************************/
    function panesMouseMove(evt) {
        //debugger
       // console.log("panesMouseMove")
        const el = evt.srcElement;

        if (sActiveResizeBarId !== "") {
            resizeBarDragMove(evt);
        } // end if

    } // end of function panesMouseMove()

    /********************************************************************************
     * 
	 ********************************************************************************/
    function panesMouseUp(evt) {
        //debugger
        console.log("panesMouseUp")

        const el = evt.srcElement;

        if (sActiveResizeBarId !== "") {
            
            resizeBarDragEnd(evt);
        } // end if

    } // end of function panesMouseUp()



    /********************************************************************************
     * called by:  CreateResizeBar()
	 ********************************************************************************/
    function posStyle(previousPane, sAlign) {
        console.log("private posStyle() function called")
        let sStyle = "";

        let nTop = getVal(previousPane,"top",-1);
        let nBottom = getVal(previousPane,"bottom",-1);
        let nLeft = getVal(previousPane,"left",-1);
        let nRight = getVal(previousPane,"right",-1);

        if (sAlign == "top" && nTop !== -1) {
            nTop = nTop + previousPane.height - orvRESIZE_BAR_HALFTHICKNESS;
        } // end if

        if (sAlign == "bottom" && nBottom !== -1) {
            nBottom = nBottom + previousPane.height - orvRESIZE_BAR_HALFTHICKNESS;
        } // end if

        if (sAlign == "left" && nLeft !== -1) {
            nLeft = nLeft + previousPane.width - orvRESIZE_BAR_HALFTHICKNESS;
        } // end if

        if (sAlign == "right" && nRight !== -1) {
            nRight = nRight + previousPane.width - orvRESIZE_BAR_HALFTHICKNESS;
        } // end if

        if (nTop > -1) {
            sStyle = sStyle + "top:"+(nTop)+"px;";
        } // end if

        if (nBottom > -1) {
            sStyle = sStyle + "bottom:"+(nBottom)+"px;";
        } // end if

        if (nLeft > -1) {
            sStyle = sStyle + "left:"+(nLeft)+"px;";
        } // end if

        if (nRight > -1) {
            sStyle = sStyle + "right:"+(nRight)+"px;";
        } // end if

        return sStyle;
    } // end of function posStyle()



	/********************************************************************************
	 ********************************************************************************/
    function getStylePxVal(sValue) {
        let nPos = sValue.indexOf("px");

        if (nPos>-1) {
            sValue = sValue.substr(0,nPos);
        } // end if

        return sValue - 0;
    } // end of function getStylePxVal()



	/********************************************************************************
	 ********************************************************************************/
	function getVal(params,sParam,defVal) {
		if (!params) {
			params = {};
		} // end if

		if (typeof params[sParam] !== "undefined") {
			return params[sParam];
		} else {
			return defVal;
		} // if / else

    } // end of function getVal()
    
    

	/********************************************************************************
	 ********************************************************************************/    
    function resizeBarDragBegin(evt) {

        if (evt.buttons !== orvLEFT_MOUSE_BUTTON) {
            // if not the Left mouse button that was pressed, then leave!
            return;
        } // end if

        const el = evt.srcElement;

        sActiveResizeBarId = el.id;
        nResizeStartX = evt.pageX;
        nResizeStartY = evt.pageY;
        activeResizeBarObj = resizeBarsById[sActiveResizeBarId];
        sResizeAlign = activeResizeBarObj.align;
       
        nBarStartPos = getStylePxVal(el.style[sResizeAlign]);


        resizeBarEl = el;
        resizeBarEl.style.backgroundColor = orvRESIZE_BAR_DRAGCOLOR;

        
      
        nPrevPanelStartSize = activeResizeBarObj.previousPane.width;
        nCurrentPanelStartSize = activeResizeBarObj.currentPane.width;

        if (sResizeAlign === "top" || sResizeAlign === "bottom") {
            nPrevPanelStartSize = activeResizeBarObj.previousPane.height;
            nCurrentPanelStartSize = activeResizeBarObj.currentPane.height;
        } // end if

        nCurrentPanelStartLeft = activeResizeBarObj.currentPane.left;
        nCurrentPanelStartRight = activeResizeBarObj.currentPane.right;
        nPrevPanelStartLeft = activeResizeBarObj.previousPane.left;
        nPrevPanelStartRight = activeResizeBarObj.previousPane.right;

        nCurrentPanelStartTop = activeResizeBarObj.currentPane.top;
        nCurrentPanelStartBottom = activeResizeBarObj.currentPane.bottom;
        nPrevPanelStartTop = activeResizeBarObj.previousPane.top;
        nPrevPanelStartBottom = activeResizeBarObj.previousPane.bottom;

        relatedItemsStartValues = [];
        
        //debugger
    } // end of function resizeBarDragBegin()


	/********************************************************************************
	 ********************************************************************************/    
    function resizeBarDragEnd(evt) {
        const el = evt.srcElement;

        resizeBarEl.style.backgroundColor = orvRESIZE_BAR_COLOR;

        nResizeStartX = -1;
        nResizeStartY = -1;
        sActiveResizeBarId = "";
        activeResizeBarObj = undefined;
        resizeBarEl = undefined;
        relatedItemsStartValues = [];
    } // end of function resizeBarDragEnd()


	/********************************************************************************
     * 
     *  Called by:   panesMouseMove()
	 ********************************************************************************/    
    function resizeBarDragMove(evt) {

        if (evt.buttons !== orvLEFT_MOUSE_BUTTON) {
            // if the Left mouse button is no longer being pressed, then 
            // the user must have taken their hand off the mouse button
            // after leaving the mouse up area. So we want to force an End of the drag operation!
            resizeBarDragEnd(evt);
            return;
        } // end if

        resetAllPaneAdjustFlags();

        const el = evt.srcElement;

        let nOffsetX = evt.pageX - nResizeStartX;
        let nOffsetY =  nResizeStartY - evt.pageY;
        let nNewPos, nNewPos2, nNewWidth, nNewHeight;
        let nMax,extraPanes;
       // let nOffsetY = evt.pageY - nResizeStartY;


        if (sResizeAlign === "top") {
            // Resize Bar
            nNewPos = nBarStartPos+nOffsetY;
            resizeBarEl.style.top = (nNewPos)+"px"
        } // end if

        if (sResizeAlign === "bottom") {
            // Resize Bar
            nNewPos = nBarStartPos+nOffsetY;
            resizeBarEl.style.bottom = (nNewPos)+"px"

            // current pane:
            // =============
            let nOldCurrentBottom = activeResizeBarObj.currentPane.bottom;
            let nOldCurrentHeight = activeResizeBarObj.previousPane.height;

            nNewPos2 = nCurrentPanelStartBottom+nOffsetY;            
            activeResizeBarObj.currentPane.setNewPos(nNewPos2, "bottom");
            activeResizeBarObj.currentPane.setPosAdjustFlag(true);

            // process extra current panes:
            extraPanes = activeResizeBarObj.extraPanesForCurrent;
            nMax = extraPanes.length;
            for (let n=0;n<nMax;n++) {
                const extraPane = extraPanes[n].pane;

                console.log("extraPane.bottom="+extraPane.bottom);
                console.log("nOldCurrentBottom="+nOldCurrentBottom);

                if (extraPane.bottom === nOldCurrentBottom) {
                    extraPane.setNewPos(nNewPos2, "bottom");
                } // end if

            } // next n


            // previous pane:
            // ==============
            nNewHeight = nPrevPanelStartSize+nOffsetY;
            activeResizeBarObj.previousPane.setNewHeight(nNewHeight);
            activeResizeBarObj.previousPane.setPosAdjustFlag(true);

            // process extra previous panes:
            extraPanes = activeResizeBarObj.extraPanesForPrevious;
            nMax = extraPanes.length;
            for (let n=0;n<nMax;n++) {
                const extraPane = extraPanes[n].pane;

                console.log("extraPane.height="+extraPane.height);
                console.log("nOldCurrentHeight="+nOldCurrentHeight);

                if (extraPane.height === nOldCurrentHeight) {
                    extraPane.setNewHeight(nNewHeight);
                } // end if

            } // next n

        } // end if (sResizeAlign === "bottom")


        if (sResizeAlign === "left") {
            // Resize Bar
            nNewPos = nBarStartPos+nOffsetX;
            resizeBarEl.style.left = (nNewPos)+"px"

            // previous pane
            nNewWidth = nPrevPanelStartSize+nOffsetX;
            activeResizeBarObj.previousPane.setNewWidth(nNewWidth);
            activeResizeBarObj.previousPane.setPosAdjustFlag(true);

            // current pane
            nNewPos2 = nCurrentPanelStartLeft+nOffsetX;
            activeResizeBarObj.currentPane.setNewPos(nNewPos2, "left");
            activeResizeBarObj.currentPane.setPosAdjustFlag(true);
        } // end if

        if (sResizeAlign === "right") {
            // Resize Bar
            nNewPos = nBarStartPos-nOffsetX;
            resizeBarEl.style.right = (nNewPos)+"px"

            // current pane
            nNewPos2 = nCurrentPanelStartRight-nOffsetX;            
            activeResizeBarObj.currentPane.setNewPos(nNewPos2, "right");
            activeResizeBarObj.currentPane.setPosAdjustFlag(true);

            // previous pane
            nNewWidth = nPrevPanelStartSize-nOffsetX;            
            activeResizeBarObj.previousPane.setNewWidth(nNewWidth);
            activeResizeBarObj.previousPane.setPosAdjustFlag(true);
        } // end if

    } // end of function resizeBarDragMove()


 } // end of constructor function OrvPanes()
 