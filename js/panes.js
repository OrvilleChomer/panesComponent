/************************************************************************************ 
    panes.js


    Key Code Reference Tags:
         -  #library_constructor
         -  #overall_pane_and_resizebar_array_defs
         -  #internal_constants        (for library)
         -  #mouse_event_listeners
         -  #defined_library_properties
         -  #show_panes                (method for render)
         -  #viewInnards_library                        VIEW INNARDS   (Library)
         -  #library_private_functions
         -  #build_PanesMarkup_For_Container
         -  #build_Pane_Style_Block               STYLE BLOCK
         -  #build_Pane_Style_Unselectable
         -  #other_Resize_Bar_Mapping             🗺🗺🗺FINAL MAPPING 🗺🗺🗺
         -  #look_for_match
         -  #get_next_id

         PANE STUFF:
         -  #create_pane_funct
         -  #Create_Pane_constructor              pane CONSTRUCTOR  🔧🔧🔧
         -  #init_pane_instance_vars
         -  #related_panes_and_resize_bars_init
         -  #pane_positioning_vars_init
         -  #pane_start_pos_vars_init
         -  #pane_parent_container
         -  #define_pane_obj_properties            PROPERTY DEFS
         -  #pane_start_position_properties        PROPERTY DEFS
         -  #pane_edge_position_properties         PROPERTY DEFS   (pane edge)
         -  #pane_id_property_def
         -  #pane_add_pane_method     (to add a child pane to a pane)
         -  #pane_add_content
         -  #pane_add_related_pane
         -  #pane_add_resize_bar_ref  (to add a ref to a resize bar to a pane)
         -  #pane_gen_markup_method   (returns an HTML markup string)
         -  #pane_set_dom_ref         (variable refs to pane and pane content)
         -  #pane_set_new_height
         -  #pane_set_new_pos
         -  #pane_set_new_width
         -  #pane_view_innards                     VIEW INNARDS  (pane)

         RESIZE BAR STUFF:
         -  #resize_bar_add_related_item_method       --- ADD RELATED ITEM!
         -  #resize_bar_view_innards               VIEW INNARDS  (resize bar)
         -  #create_resize_bar_funct
         -  #create_resize_bar_constructor         resize bar CONSTRUCTOR 🔧🔧🔧
         -  #resize_bar_instance_array_defs
         -  #resize_prop_def                       PROPERTY DEFS
         -  #resize_bar_edge_position_properties   PROPERTY DEFS  (resize bar edge)
         -  #resize_bar_starting_pos_property_defs PROPERTY DEFS  ("" starting pos) 
         -  #resize_bar_basic_pos_properties       PROPERTY DEFS  (Basic CSS positions)
         -  #resize_bar_set_pos_adjust_flag  
         -  #resize_bar_set_start_pos      
         -  #resize_bar_set_new_pos
         -  #resize_bar_add_another_pane
         -  #resize_bar_get_html_markup
         -  #resize_bar_set_dom_ref
         

         EVENT HANDLER STUFF:
         -  #mouse_events
         -  #panes_mouse_down
         -  #panes_mouse_move                          
         -  #panes_mouse_up
         -  #resize_bar_drag_begin
         -  #resize_bar_drag_end
         -  #resize_bar_drag_move                  RESIZE BAR DRAG!

         MISC:
         -  #pos_style
         -  #get_val               (used to process input params)
         
         -



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


/*************************************************************************
 *  Constructor for Library
 *  #library_constructor
 *************************************************************************/ 
 function OrvPanes(siMContainerId) {
    console.log("OrvPanes() Constructor function called")
    const pns = this;
    const masterContainer = {}; // object representing our master container
    const Q = '"';
    
    // #overall_pane_and_resizebar_array_defs
    let containerPanesByIndex = [];
    let containerPanesById = [];
    let bContentPaneAdded = false;
    let allPanesByIndex = [];
    let allPanesById = [];
    let resizeBarsByIndex = [];  // June 12, 2020
    let resizeBarsById = [];

    let nNextIdNum = 1;

    let bLogResizeNumbers = false;

    let nReportDepth = 0; // for console log report

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
    // #internal_constants
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

    // #mouse_event_listeners
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

    //  #defined_library_properties 

    //setupObjTypeProp(pns,"orvPanes");
    setupObjTypeProp(pns,"panes");  // June 22, 2020

    Object.defineProperties(pns, {
        "allPanesByIndex": {
            "get": function() { 
                return allPanesByIndex;
            } // end of getter code!
        },

        "masterContainerNode": {
            "get": function() { 
                return masterContainerNd;
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

      #show_panes
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

        
        otherResizeBarMapping();
            


        bPanesRendered = true;
    } // end of pns.showPanes() method


    /********************************************************************************
     *   Used for debugging to look at the internal state of the overall
     *   container for the panes in your browser's debugger.
     *   #viewInnards_library
     ********************************************************************************/
    pns.viewInnards = function() {

        debugger;
    } // end of pane.viewInnards() method



    // ##############################################################

    //    PRIVATE FUNCTIONS BELOW:

    //    #library_private_functions

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
    *  #build_PanesMarkup_For_Container
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
    *   #build_Pane_Style_Block
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
    * 
    *   #build_Pane_Style_Unselectable
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
   *
   ********************************************************************************/    
    function isApproxEqualTo(val1, val2) {
        if (val1 === val2) return true;

        if (val1 > val2) {
            let nTemp = val1;
            val1 = val2;
            val2 = nTemp;
        } // end if

        nDiff = val2 - val1;
        
        let nMarginForError = orvRESIZE_BAR_HALFTHICKNESS;

        if (nMarginForError < 3) {
            nMarginForError = 3;
        } // end if

        if (nDiff<= nMarginForError) {
            return true;
        } // end if

        return false;
    } // end of function isApproxEqualTo()




  /********************************************************************************
   * 
   *  Called from:   pns.showPanes() method
   * 
   * #other_Resize_Bar_Mapping
   * 
   *  sorta doing a brute force method here... it shouldn't matter performance-wise
   *  in this particular application.
   ********************************************************************************/
   function otherResizeBarMapping() {

       console.log("😜😜otherResizeBarMapping()  called 😜😜")

       const nMax1 = resizeBarsByIndex.length;
       const nMax2 = allPanesByIndex.length;



       console.group("Processing Resize Bars...   ("+nMax1+") ... outer loop (n1)");
       for (let n1=0;n1<nMax1;n1++) {
           const rb = resizeBarsByIndex[n1];
           

           console.groupCollapsed("processing resize bar... id: '"+rb.id+"'   index: "+n1)
           console.log("resizeClass:    '"+rb.resizeClass+"'") 
           console.log("style:          '"+rb.style+"'") 

           let sSearchForPaneId = "";  // only for debugging

           if (rb.id ==="orvPaneEl7") {
               //sSearchForPaneId = "orvPaneEl3";
               //debugger;
           } // end if

           console.group("Processing Panes and comparing to this resize bar...   first inner loop");
           for (let n2=0;n2<nMax2;n2++) {
               const pn = allPanesByIndex[n2];
               console.log("comparing with pane: '"+pn.id+"'")

               if (pn.id === sSearchForPaneId) {
                   debugger
               } // end if

               lookForMatch(rb, pn);
           } // next n2 (panes)

           console.groupEnd(); // end of processing panes

           

           // doing sub-loop through resize bars...
           console.group("Comparing to other resize bars...   2nd inner loop");
           for (let n3=0;n3<nMax1;n3++) {
                const rb2 = resizeBarsByIndex[n3];
                
                if (rb.id !== rb2.id) {
                    console.log("comparing with resize bar: '"+rb2.id+"'")
                    lookForMatch(rb, rb2);
                } // end if
           } // next n3
           console.groupEnd(); // end of Comparing to other resize bars

           console.groupEnd(); // end of Outer resize bar (singular)

       } // next n1 (resize bars)
       console.groupEnd(); // end of processing resize bars

       console.log("completed executing: %cotherResizeBarMapping()","font-weight:bold;color:blue;")
   } // end of function otherResizeBarMapping()




  /********************************************************************************
   * 
   * 
   *    #look_for_match
   * 
   ********************************************************************************/   
   function lookForMatch(itm1, itm2) {
        console.group("lookForMatch() called.")

        let sObjType = itm2.objType;

        let sChangeAttribute = "";
        
        // Orv See:  "MORE PANE NOTES"   in Evernote!
        if (itm1.resizeClass === "orvPaneResizeToolbarHorizontal") {
                                //  👇 bottom edge of pane
                                                  //  👇 top edge of horizontal resize bar
            if (isApproxEqualTo(itm2.bottomEdge, itm1.topEdge)) {
                // formula needs to determine if they are overlapping
                if (itm1.leftEdge <= itm2.leftEdge && itm1.rightEdge >= itm2.rightEdge) {
                    // match
                    // pane is 👉👉  **[Above]**   resize bar
                    // will want to adjusts pane's css {bottom, or height} property
                    console.log("%cA Match Found!","color:red;")

                    sChangeAttribute = "bottom";

                    if (itm2.align ==="top" || itm2.align ==="bottom") {
                        sChangeAttribute = "height";
                    } // end if
                                                             //   👇  pos of pane related to resize bar
                    itm1.addRelatedItem(itm2, sChangeAttribute, "above")
                    console.groupEnd() // lookForMatchPane group
                    return
                } // end if

            } // end if (isApproxEqualTo(rb.topEdge, pn.bottomEdge))

            //*** if (rb.bottomEdge === pn.topEdge) 
                                   //  👇 bottom edge of horizontal resize bar
                                                  //  👇 top edge of pane
            if (isApproxEqualTo(itm1.bottomEdge, itm2.topEdge)) {
                if (itm1.leftEdge <= itm2.leftEdge && itm1.rightEdge >= itm2.rightEdge) {
                    // match
                    // pane is 👉👉 **[Below]**   resize bar
                    //will want to adjusts pane's css {height, or top} property
                    console.log("%cA Match Found!","color:red;")

                    sChangeAttribute = "top";

                    if (itm2.align ==="top" || itm2.align ==="bottom") {
                        sChangeAttribute = "height";
                    } // end if

                                                              //   👇  pos of pane related to resize bar
                    itm1.addRelatedItem(itm2, sChangeAttribute, "below")
                    console.groupEnd() // lookForMatchPane group
                    return;
                } // end if                 

            } // end if (isApproxEqualTo(rb.bottomEdge, pn.topEdge))

        } // end if(itm1.resizeClass === "orvPaneResizeToolbarHorizontal")


        //orvPaneResizeToolbarVertical
        if (itm1.resizeClass === "orvPaneResizeToolbarVertical") {
            //*** if (rb.leftEdge === pn.rightEdge)
                                             //  👇left edge of vertical resize bar
                               //  👇 right edge of pane
            if (isApproxEqualTo(itm2.rightEdge, itm1.leftEdge)) {
                if (itm1.topEdge <= itm2.topEdge && itm1.bottomEdge >= itm2.bottomEdge) {
                    // match
                    // pane is to the 👉👉 **[Left]**  of the resize bar
                    // will want to adjust pane's css  {right, or width} property
                    console.log("%cA Match Found!","color:red;")

                    sChangeAttribute = "right";

                    if (itm2.align ==="left" || itm2.align ==="right") {
                        sChangeAttribute = "width";
                    } // end if
                                                            //   👇  pos of pane related to resize bar
                    itm1.addRelatedItem(itm2, sChangeAttribute,"left")
                    console.groupEnd() // lookForMatchPane group
                    return;

                } // end if

            } // end if (isApproxEqualTo(rb.leftEdge, pn.rightEdge))

            //*** if (rb.rightEdge === pn.leftEdge)
                               //  👇 right edge of vertical resize bar
                                                //  👇 left edge of pane
            if (isApproxEqualTo(itm1.rightEdge, itm2.leftEdge)) {
                if (itm1.topEdge <= itm2.topEdge && itm1.bottomEdge >= itm2.bottomEdge) {
                    // match
                    // pane is to the 👉👉 **[Right]**  of the resize bar
                    // will want to adjust pane's css {left or width} property
                    console.log("%cA Match Found!","color:red;")
                    sChangeAttribute = "left";

                    if (itm2.align ==="left" || itm2.align ==="right") {
                        sChangeAttribute = "width";
                    } // end if
                                                             //   👇  pos of pane related to resize bar
                    itm1.addRelatedItem(itm2, sChangeAttribute, "right")
                    console.groupEnd() // lookForMatchPane group
                    return;
                } // end if
            } // end if

        } // end if(itm1.resizeClass === "orvPaneResizeToolbarVertical")
       
        console.groupEnd() // lookForMatch group

   } // end of function lookForMatch()




   /********************************************************************************
    * 
    * #get_next_id
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

     #create_pane_funct
    ********************************************************************************/ 
    function createPane(params) {
        console.log("🌞🌞🌞createPane() function called 🌞🌞🌞")
        const orvWINDOW_STATE_NORMAL = 0;
        const orvWINDOW_STATE_MAXIMIZED = 1;
        const orvWINDOW_STATE_MINIMIZED = 2;

        //  #Create_Pane_constructor
        function CreatePane(params) {
            console.log("🌜🌜🌜CreatePane() Constructor called 🌜🌜🌜")
            const pane = this;
            const sPaneId = getNextId();

            // #init_pane_instance_vars
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
            // #related_panes_and_resize_bars_init
            let relatedItemsByIndex = []; 
            let relatedItemsById = []; 

            
            let sPaneStyle = "";
            let sPaneContent = getVal(params,"paneContent","");

            // window specific GUI settings
            let bMaxRestoreBtn = getVal(params,"showMaxRestoreBtn",true);
            let bMinBtn = getVal(params,"showMinBtn",true);


            let bHelpBtn = getVal(params,"showHelpBtn",false);
            let bCloseBtn = getVal(params,"showCloseBtn",true);

            let childPanesByIndex = [];
            let childPanesById = [];

            let paneResizeBarsByIndex = [];
            let paneResizeBarsById = [];

            // positioning:
            //  #pane_positioning_vars_init
            let nPaneLeft = -1;
            let nPaneRight = -1;
            let nPaneTop = -1;
            let nPaneBottom = -1;
            let nPaneHeight = nCurrentHeight;
            let nPaneWidth = nCurrentWidth;
            let nWindowLeft = -1;
            let nWindowTop = -1;

            // #pane_start_pos_vars_init
            // Note: Starting Pos is starting pos at the beginning of a resize bar drag!
            let nStartingTop = -1;
            let nStartingBottom = -1;
            let nStartingHeight = nCurrentHeight;
            let nStartingLeft = -1;
            let nStartingRight = -1;
            let nStartingWidth = nCurrentWidth;
            
            let nLastCurrentWidth = nCurrentWidth;
            let nLastCurrentHeight = nCurrentHeight;
            let nLastPaneLeft = nPaneLeft;
            let nLastPaneRight = nPaneRight;
            let nLastPaneTop = nPaneTop;
            let nLastPaneBottom = nPaneBottom;

            // ref objects:
            // #pane_parent_container
            let parentContainer = getVal(params,"parentContainer",masterContainer);  // masterContainer is the fallback
            let parentContainerNode; // DOM node for the parent container
            
            if (parentContainer.objType === "panes") {
                parentContainerNode = parentContainer.masterContainerNode
            } // end if

            // ref to pane DIV that is part of DOM (when it is finally generated)
            let paneNd,paneContentNd;

            console.log("sCaption='"+sCaption+"'   ... sPaneId: '"+sPaneId+"'");

            // define some read-only properties:
            // #define_pane_obj_properties
            console.log("about to define custom getters.")
            Object.defineProperties(pane, {
                //
                "minWidth": {
                    "get": function() { 
                        return nMinWidth;
                    } // end of getter code!
                },  // end of "minWidth" property definition

                "width": {
                    "get": function() { 
                        return nCurrentWidth;
                    } // end of getter code!
                },

                "caption": {
                    "get": function() { 
                        return sCaption;
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


                // ####################################################################
                //  #pane_start_position_properties
                //
                //  The position of these things at the beginning of a 
                //  resize bar drag.
                // ####################################################################

                "startingTop": {
                    "get": function() { 
                        return nStartingTop;
                    } // end of getter code!
                },

                "startingBottom": {
                    "get": function() { 
                        return nStartingBottom;
                    } // end of getter code!
                },

                "startingHeight": {
                    "get": function() { 
                        return nStartingHeight;
                    } // end of getter code!
                },

                "startingLeft": {
                    "get": function() { 
                        return nStartingLeft;
                    } // end of getter code!
                },

                "startingRight": {
                    "get": function() { 
                        return nStartingRight;
                    } // end of getter code!
                },

                "startingWidth": {
                    "get": function() { 
                        return nStartingWidth;
                    } // end of getter code!
                },


                // ####################################################################
                //  #pane_edge_position_properties
                // ####################################################################
                "leftEdge": {
                    "get": function() { 
                        if (typeof parentContainerNode === "undefined") {
                            return -1;
                        } else if (nPaneLeft > -1) {
                            return nPaneLeft;
                        } else if (nCurrentWidth > 0 && nPaneRight>-1) {
                            return parentContainerNode.offsetWidth - nCurrentWidth - nPaneRight
                        } else {
                            return -1;
                        } // end if/else if/else if/else

                        
                        
                    } // end of getter code!
                },

                "rightEdge": {
                    "get": function() { 
                        if (typeof parentContainerNode === "undefined") {
                            return -1;
                        } else {
                            if (nPaneRight > -1) {
                                return parentContainerNode.offsetWidth - nPaneRight;
                            } else if (nCurrentWidth>0 && nPaneLeft>-1) {
                                return nPaneLeft + nCurrentWidth;
                            } else {
                                return -1;
                            } // end if/else
                            
                        } // end if/else
                    } // end of getter code!
                },

                "topEdge": {
                    "get": function() { 
                        if (typeof parentContainerNode === "undefined") {
                            return -1;
                        } else if (nPaneTop > -1) {
                            return nPaneTop;
                        } else if (nCurrentHeight > 0 && nPaneBottom>-1) {
                            return parentContainerNode.offsetHeight - nCurrentHeight - nPaneBottom
                        } else {
                            return -1;
                        } // end if/else if/else if/else

                        return nPaneTop;
                    } // end of getter code!
                },

                "bottomEdge": {
                    "get": function() { 
                        if (typeof parentContainerNode === "undefined") {
                            return -1;
                        } else {
                            
                            if (nPaneBottom > -1) {
                                return parentContainerNode.offsetHeight - nPaneBottom;
                            } else if (nCurrentHeight>0 && nPaneTop>-1) {
                                return nPaneTop + nCurrentHeight;
                            } else {
                                return -1;                                
                            } // end if
                        } // end if/else
                    } // end of getter code!
                },

                // ####################################################################
                // ####################################################################

                // #pane_id_property_def
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

                /*
                  Will not be able to access property below properly until first render
                  has occurred!  ... if a Pane that is a child of another Pane
                 */
                "parentContainerNode": {
                    "get": function() { 
                        return parentContainerNode;
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
            *  called at the beginning of a resize bar drag.
	        ********************************************************************************/
           pane.setStartPos = function() {
                console.log("called pane.setStartPos() method")
                nStartingTop = nPaneTop;
                nStartingBottom = nPaneBottom;
                nStartingHeight = nPaneHeight;
                nStartingLeft = nPaneLeft;
                nStartingRight = nPaneRight;
                nStartingWidth = nPaneWidth;
           } // end of pane.setStartPos()  method
           
           

           /********************************************************************************
            *  
	        ********************************************************************************/
            pane.setPosAdjustFlag = function(bNewValue) {
                bPosAdjusted = bNewValue;
            } // end of pane.setPosAdjustFlag()  method



           /********************************************************************************
            *  add a child pane to the current pane...
            *  #pane_add_pane_method
	        ********************************************************************************/
            pane.addPane = function(params) {
                console.group(" 🍼🍼  pane.addPane() method called to add a Child pane!!  🍼🍼")
                params.parentContainer = pane;
                const pane = createPane(params);
                console.groupEnd();

                return pane;

            } // end of addPane() method (on pane object!)



           /********************************************************************************
            *  addContent is NOT used for panes that already have child panes.
            *  #pane_add_content
	        ********************************************************************************/
            pane.addContent = function(params) {
                console.log(" 🍔 pane.addContent() method called")
                sPaneContent = getVal(params,"paneContent","");

                if (bPanesRendered) {
                    paneContentNd.innerHTML = sPaneContent;
                } // end if

            } // end of pane.addContent() method (for pane object only)



           /********************************************************************************
            *  lets pane know about any resize bars that belong to it
            *  called near the end of the CreateResizeBar() function
            *  for the current pane and the previous pane.
            * 
            *  This is so each pane "knows" what resize bars are associated with it!
            * 
            *   Called by:   CreateResizeBar()   Constructor
            * 
            *   #pane_add_resize_bar_ref
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
            * 
            *   #pane_gen_markup_method
	        ********************************************************************************/            
            pane.genMarkup = function(theNextPositions, theLastCreatedPanes) {
                console.log("⛄ pane.genMarkup() method called ⛄")
                const theNext = theNextPositions;
                const theLast = theLastCreatedPanes;
                const s1=[]; // HTML for any resize bar
                const s2=[]; // HTML for the current pane
            
                
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

                        sPaneStyle = "top:"+(nPaneTop)+"px;"
                        sPaneStyle = sPaneStyle +"height:"+(nCurrentHeight)+"px;";
                        sPaneStyle = sPaneStyle +"left:"+(nPaneLeft)+"px;"
                        sPaneStyle = sPaneStyle +"right:"+(nPaneRight)+"px;"
                        s2.push(sPaneStyle);
                        
                        if (theNext.topPos>0) {
                            console.log("about to call: createResizeBar()")
                            const rb = createResizeBar({align: "top", previousPane: theLast.topPane, 
                                                        parentContr:parentContainer, parentContainerEl: parentContainerNode,
                                                        currentPane: pane, pos: theNext.topPos});
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
                            const rb = createResizeBar({align: "bottom", previousPane: theLast.bottomPane, 
                                                        parentContr:parentContainer, parentContainerEl: parentContainerNode,
                                                        currentPane: pane, pos: theNext.bottomPos});
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
                            const rb = createResizeBar({align: "left", previousPane: theLast.leftPane,
                                                        parentContr:parentContainer, parentContainerEl: parentContainerNode, 
                                                        currentPane: pane, pos: theNext.leftPos});
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
                            const rb = createResizeBar({align: "right", previousPane: theLast.rightPane,
                                                        parentContr:parentContainer, parentContainerEl: parentContainerNode, 
                                                        currentPane: pane, pos: theNext.rightPos});
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
                            const rb = createResizeBar({align: "top", previousPane: theLast.topPane, 
                                                        parentContr:parentContainer, parentContainerEl: parentContainerNode,
                                                        currentPane: pane, pos: theNext.topPos});
                            s1.push(rb.getHtmlMarkup());
                            theNext.topPos = theNext.topPos + orvRESIZE_BAR_THICKNESS;
                        } // end if

                        if (theNext.bottomPos>0) {
                            const rb = createResizeBar({align: "bottom", previousPane: theLast.bottomPane, 
                                                        parentContr:parentContainer, parentContainerEl: parentContainerNode,
                                                        currentPane: pane, pos: theNext.bottomPos});
                            s1.push(rb.getHtmlMarkup());
                            theNext.bottomPos = theNext.bottomPos + orvRESIZE_BAR_THICKNESS;
                        } // end if

                        if (theNext.leftPos>0) {
                            const rb = createResizeBar({align: "left", previousPane: theLast.leftPane, 
                                                        parentContr:parentContainer, parentContainerEl: parentContainerNode,
                                                        currentPane: pane, pos: theNext.leftPos});
                            s1.push(rb.getHtmlMarkup());
                            theNext.leftPos = theNext.leftPos + orvRESIZE_BAR_THICKNESS;
                        } // end if

                        if (theNext.rightPos>0) {
                            const rb = createResizeBar({align: "right", previousPane: theLast.rightPane, 
                                                        parentContr:parentContainer, parentContainerEl: parentContainerNode,
                                                        currentPane: pane, pos: theNext.rightPos});
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
             * 
             *   #pane_set_dom_ref
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
             * 
             *   #pane_set_new_height
	         ********************************************************************************/
            pane.setNewHeight = function(nNewHeight) {
                let sNewHeight = "";

                if (bLogResizeNumbers) {
                    sNewHeight = "   nNewHeight:"+nNewHeight;
                } // end if

                if (nNewHeight === -1) {
                    console.log("new height value was (-1)... state was not set!")
                    return;
                } // end if

                console.log("pane.setNewHeight() called."+sNewHeight)
                console.log("  😳 pane.id: '"+sPaneId+"'")
                console.log("   😳 nLastCurrentHeight (before): "+nLastCurrentHeight)


          //      if (bPosAdjusted) return;

                if (nNewHeight < nMinHeight) {                    
                    return false; // failed
                } // end if

                nLastCurrentHeight = nCurrentHeight;
                console.log("  😳 nLastCurrentHeight (after): "+nLastCurrentHeight)
                nCurrentHeight = nNewHeight;
                paneNd.style.height = (nCurrentHeight)+"px";
                return true; // was a success
            } // end of pane.setNewHeight() method


            /********************************************************************************
             * 
             *   Called from:   resizeBarDragMove()
             * 
             *   #pane_set_new_pos
	         ********************************************************************************/
            pane.setNewPos = function(nNewPos, sAlign) {
                let sNewPos = "";

                if (bLogResizeNumbers) {
                    sNewPos = "   nNewPos:"+nNewPos;
                } // end if

                console.log("pane.setNewPos() called.   sAlign: '"+sAlign+"' "+sNewPos)
                console.log("   😳 pane.id: '"+sPaneId+"'")
                
                if (nNewPos === -1) {
                    console.log("input value was (-1)... state was not set!")
                    return false;
                } // end if

                if (nNewPos < 0) {
                    return false;
                }

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
                return true; // was a success
            } // end of pane.setNewPos() method



            /********************************************************************************
             * 
             *   Called by:   resizeBarDragMove()
             * 
             *   Sets the panel width of the current pane in the DOM
             * 
             *   #pane_set_new_width
	         ********************************************************************************/
            pane.setNewWidth = function(nNewWidth) {
                let sNewWidth = "";

                if (bLogResizeNumbers) {
                    sNewWidth = "   nNewWidth:"+nNewWidth;
                } // end if

                if (nNewWidth === -1) {
                    console.log("new width is (-1) state was not set!")
                    return false;
                } // end if

                console.log("pane.setNewWidth() called."+sNewWidth)
                console.log("   😳 pane.id: '"+sPaneId+"'")
                console.log("   😳 nLastCurrentWidth (before): "+nLastCurrentWidth)

             //   if (bPosAdjusted) return;

                if (nNewWidth < nMinWidth) {                    
                    return false; // failed
                } // end if

                nLastCurrentWidth = nCurrentWidth;
                console.log("   😳 nLastCurrentWidth (after): "+nLastCurrentWidth)

                nCurrentWidth = nNewWidth;
                paneNd.style.width = (nCurrentWidth)+"px";
                
                console.log("new value for:   paneNd.style.width: '"+paneNd.style.width+"'")
                return true; // was a success
            } // end of pane.setNewWidth() method


            /********************************************************************************
             *   Used for debugging to look at the internal state of a "pane"
             *   in your browser's debugger
             *   
             *   #pane_view_innards
	         ********************************************************************************/
            pane.viewInnards = function(bNoDrilldown) {
                let nMax;
                let sIndent = "";

                nReportDepth = nReportDepth + 1;

                const fm1 = "color:blue;"
                const fm1b = "color:blue;font-style:italic;"
                const fm2 = "color:red;font-weight:bold;";
                const fm3 = "background-color:#ffcc99;padding:4px;";

                if (typeof bNoDrilldown === "undefined") {
                    console.clear();
                    console.log(" ")
                    console.log("***************************************************************")
                    console.log(" - VIEW INNARDS... FOR SELECTED PANE:")
                    console.log("    To return to stepping through the code,")
                    console.log("    go to the %c'sources'%c tab.","font-weight:bold","")
                    console.log("***************************************************************")
                } else {
                   // sIndent = "    ";
                } // end if

                if (typeof bNoDrilldown === "undefined") {
                    console.group("🔑%cid:                  %c'"+pane.id+"'",fm1,fm2)
                } else {
                    console.groupCollapsed("%c🔑id:                  %c'"+pane.id+"'",fm1,fm2)
                } // end if/else

                console.log(sIndent+"%cobjType:             %c'"+pane.objType+"'",fm1,fm2)
                console.log(sIndent+"%ccaption:             %c'"+pane.caption+"'",fm1,fm2)
                console.log(sIndent+"%cleft:                 %c"+pane.left+" ",fm1,fm2)
                console.log(sIndent+"%cright:                %c"+pane.right+" ",fm1,fm2)
                console.log(sIndent+"%ctop:                  %c"+pane.top+" ",fm1,fm2)
                console.log(sIndent+"%cbottom:               %c"+pane.bottom+" ",fm1,fm2)
                console.log(sIndent+"%cwidth:                %c"+pane.width+" ",fm1,fm2)
                console.log(sIndent+"%cheight:               %c"+pane.height+" ",fm1,fm2)
                console.log(sIndent+"%cminWidth:             %c"+pane.minWidth+" ",fm1,fm2)
                console.log(sIndent+"%cminHeight:            %c"+pane.minHeight+" ",fm1,fm2)

                console.group(sIndent+"%cPane Edge Values:  ...pixels over from top-left of container...",fm3)
                console.log(sIndent+"%cleftEdge:             %c"+pane.leftEdge+" ",fm1,fm2)
                console.log(sIndent+"%crightEdge:            %c"+pane.rightEdge+" ",fm1,fm2)
                console.log(sIndent+"%ctopEdge:              %c"+pane.topEdge+" ",fm1,fm2)
                console.log(sIndent+"%cbottomEdge:           %c"+pane.bottomEdge+" ",fm1,fm2)
                console.groupEnd(); // end of Pane Edge Values group

                
                console.groupCollapsed("%crelatedItemsByIndex("+relatedItemsByIndex.length+" elements):",fm1b)
                nMax = relatedItemsByIndex.length;
                for (let n=0;n<nMax;n++) {
                    const relItm = relatedItemsByIndex[n]

                    if (typeof bNoDrilldown === "undefined")  {
                        if (relItm.objType === "pane" && nReportDepth < 6) {
                            relItm.viewInnards(true)
                        } // end if
                    } else {
                        console.group(sIndent+"🔑id:      '"+relItm.id+"'",fm1,fm2)
                        console.log(sIndent+"objType: '"+relItm.objType+"'",fm1,fm2)

                        if (relItm.objType === "pane") {
                            console.log(sIndent+"caption: '"+relItm.caption+"'",fm1,fm2)
                        } // end if
                        console.groupEnd();
                    } // end if (typeof bNoDrilldown === "undefined") / else

                    
                } // next n

                console.groupEnd(); // end of relatedItemsByIndex group
                
                if (paneResizeBarsByIndex.length === 0) {
                    console.log("paneResizeBarsByIndex(0 elements):")
                } else {
                    console.groupCollapsed("%cpaneResizeBarsByIndex("+paneResizeBarsByIndex.length+" elements):",fm1b)
                    nMax = paneResizeBarsByIndex.length;
                    for (let n=0;n<nMax;n++) {
                        const rb = paneResizeBarsByIndex[n];
    
                        if (nReportDepth < 6) {
                            if (typeof bNoDrilldown === "undefined"){
                                rb.viewInnards()
                            } else {
                                rb.viewInnards(true)
                            } // end if/else
                        } // end if

                    } // next n
                    console.groupEnd(); // end of paneResizeBarsByIndex group
                } // end if/else
                
                
                console.groupEnd(); // end of group for current pane having its innards viewed!

                nReportDepth = nReportDepth - 1;

                if (typeof bNoDrilldown === "undefined") {
                    console.log("***************************************************************")
                    console.log(" ")
                    debugger;
                    /******************************************************************************
                     * 
                     *   If you are seeing this in DevTools,  you are most likely looking 
                     *   at the [Sources] tab.
                     * 
                     *   To see the "viewInnards" report just generated, click on the [Console] tab.
                     * 
                     ******************************************************************************/
                } // end if

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
    *   #create_resize_bar_funct
	********************************************************************************/
    function createResizeBar(params) {
        console.log("createResizeBar() called")

       /********************************************************************************
        *    
        *    Called by the createResizeBar() function to return an encapsulated
        *    {resizeBar} JavaScript object.
        * 
        *    #create_resize_bar_constructor
	    ********************************************************************************/
        function CreateResizeBar(params) {
            console.log("CreateResizeBar() constructor called")
            const resizeBar = this;
            
            const sResizeBarId = getNextId();

            let sAlign = getVal(params,"align","left");
            let sResizeClass;
            let sStyle = "";
            let resizeBarNd; // DOM node element of resize bar


            let parentContainer = getVal(params,"parentContr",{});
  
            // DOM node element of the parent container
            let parentContainerNode = getVal(params,"parentContainerEl",{});

            // #resize_bar_instance_array_defs
            let relatedItemsByIndex = [];            
            
            // Note: Starting Pos is starting pos at the beginning of a resize bar drag!
            let nStartingLeft = -1,nStartingRight = -1,nStartingTop = -1,nStartingBottom = -1;

            let nResizeLeft = -1,nResizeRight = -1,nResizeTop = -1,nResizeBottom = -1;
            let nLastResizeLeft,nLastResizeRight,nLastResizeTop,nLastResizeBottom;
            let bResizeBarPosAdjusted = false;

            // reference to pane objects on either side of resize bar:
            let previousPane = params.previousPane;
            let currentPane = params.currentPane;
            

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


                // #########################################################################################
                //    #resize_bar_edge_position_properties
                // #########################################################################################

                "leftEdge": {
                    "get": function() { 
                        
                        if (typeof parentContainerNode === "undefined") {
                            return -1;
                        } else if (nStartingLeft > -1) {
                            return nStartingLeft;
                        } else if (nStartingRight > -1) {
                            return parentContainerNode.offsetWidth - nStartingRight - orvRESIZE_BAR_HALFTHICKNESS;
                        } // end if / else if / else

                    } // end of getter code!
                },  // end of overall 'leftEdge' property block!

                "rightEdge": {
                    "get": function() { 
                        if (typeof parentContainerNode === "undefined") {
                            return -1;
                        } else if (nStartingRight > -1) {
                            return parentContainerNode.offsetWidth - nStartingRight;
                    //    } else if (nStartingRight > -1) {

                        } else {
                            return nStartingLeft + orvRESIZE_BAR_THICKNESS;
                        } // end if / else if / else

                    } // end of getter code!
                },

                "topEdge": {
                    "get": function() { 
                        if (typeof parentContainerNode === "undefined") {
                            return -1;
                        } else if (nStartingTop > -1) {
                            return nStartingTop;
                        } else if (nStartingBottom > -1) {
                            return parentContainerNode.offsetHeight - nStartingBottom - orvRESIZE_BAR_HALFTHICKNESS;
                        } else {
                            return -1;
                        }
                        
                    } // end of getter code!
                },// end of overall 'topEdge' property block!


                "bottomEdge": {
                    "get": function() { 
                        if (typeof parentContainerNode === "undefined") {
                            return -1;
                        } else if (nStartingBottom > -1) {
                            return parentContainerNode.offsetHeight - nStartingBottom
                        } else if (nStartingTop > -1) {
                            return nStartingTop + orvRESIZE_BAR_HALFTHICKNESS
                        } else {
                            return -1;
                        }

                    } // end of getter code!
                },// end of overall 'bottomEdge' property block!

                // #########################################################################################
                // #########################################################################################


                "relatedItemsByIndex": {
                    "get": function() { 
                        return relatedItemsByIndex;
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

                // #resize_bar_starting_pos_property_defs

                // Note: Starting Pos is starting pos at the beginning of a resize bar drag!

                "startingLeft": {
                    "get": function() { 
                        return nStartingLeft;
                    } // end of getter code!
                },

                "startingRight": {
                    "get": function() { 
                        return nStartingRight;
                    } // end of getter code!
                },

                

                "startingTop": {
                    "get": function() { 
                        return nStartingTop;
                    } // end of getter code!
                },

                "startingBottom": {
                    "get": function() { 
                        return nStartingBottom;
                    } // end of getter code!
                },

                // #resize_bar_basic_pos_properties
                // -------------------------------------------
                "top": {
                    "get": function() { 
                        return nResizeTop;
                    } // end of getter code!
                },

                "bottom": {
                    "get": function() { 
                        return nResizeBottom;
                    } // end of getter code!
                },

                "left": {
                    "get": function() { 
                        return nResizeLeft;
                    } // end of getter code!
                },  

                "right": {
                    "get": function() { 
                        return nResizeRight;
                    } // end of getter code!
                },

                // -------------------------------------------

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

          //  if (sResizeBarId==='orvPaneEl5') debugger;

            if (sAlign=== "left" || sAlign=== "right") {
                console.log("detected need for vertical resize bar")
                sResizeClass = "orvPaneResizeToolbarVertical";                
                const retVal = posStyle(previousPane, sAlign);                
                sStyle = sStyle + retVal.style
                nResizeLeft = retVal.left;
                nResizeRight = retVal.right;
                nResizeTop = retVal.top;
                nResizeBottom = retVal.bottom;

            } // end if

            if (sAlign=== "top" || sAlign=== "bottom") {
                console.log("detected need for horizontal resize bar")
                sResizeClass = "orvPaneResizeToolbarHorizontal";
                const retVal = posStyle(previousPane, sAlign);
                sStyle = sStyle + retVal.style

                nResizeLeft = retVal.left;
                nResizeRight = retVal.right;
                nResizeTop = retVal.top;
                nResizeBottom = retVal.bottom;       
                
            } // end if

            nStartingLeft = nResizeLeft;
            nStartingRight = nResizeRight;
            nStartingTop = nResizeTop;
            nStartingBottom = nResizeBottom;

            nLastResizeLeft = nResizeLeft;
            nLastResizeRight = nResizeRight;
            nLastResizeTop = nResizeTop;
            nLastResizeBottom = nResizeBottom;

            console.log("sStyle = '"+sStyle+"'")
          //  debugger


            /********************************************************************************
             * 
             * 
             *   #resize_bar_add_related_item_method
	         ********************************************************************************/
            resizeBar.addRelatedItem = function(obj, sAdjustProperty, sPosRelatedToResizeBar) {
                console.log("resizeBar.addRelatedItem() method called...")

                if (typeof sAdjustProperty === "undefined") {
                    debugger
                } // end if

                if (typeof sPosRelatedToResizeBar === "undefined") {
                    debugger
                } // end if

                const relatedItem = {};
                relatedItem.obj = obj;
                relatedItem.objType = obj.objType;
                relatedItem.adjustProperty = sAdjustProperty;
                relatedItem.posRelatedToResizeBar = sPosRelatedToResizeBar;
                relatedItemsByIndex.push(relatedItem);
               // relatedItemsByAlignment[sAdjustProperty].push(relatedItem);
            } // end of resizeBar.addRelatedItem() method



            

            /********************************************************************************
             * 
             * 
             *   #resize_bar_view_innards
	         ********************************************************************************/
            resizeBar.viewInnards = function(bNoDrilldown) {
                const fm1 = "color:blue;"
                const fm1b = "color:blue;font-style:italic;"
                const fm2 = "color:red;font-weight:bold;";
                const fm3 = "background-color:#ffcc99;padding:4px;";
                const fm4 = "color:gray;";

                nReportDepth = nReportDepth + 1;

                console.groupCollapsed("🔑%cid:               %c'"+resizeBar.id+"'",fm1,fm2)
                console.log("%cobjType:          %c'"+resizeBar.objType+"'",fm1,fm2)
                console.log("%calign:            %c'"+sAlign+"'",fm1,fm2)
                console.log("%cstartingLeft:      %c"+resizeBar.startingLeft+" ",fm1,fm2)
                console.log("%cstartingRight:     %c"+resizeBar.startingRight+" ",fm1,fm2)
                console.log("%cstartingTop:       %c"+resizeBar.startingTop+" ",fm1,fm2)
                console.log("%cstartingBottom:    %c"+resizeBar.startingBottom+" ",fm1,fm2)
                console.log("%cmaxPos:            %c"+resizeBar.maxPos+" ",fm1,fm2)
                console.log("%cminPos:            %c"+resizeBar.minPos+" ",fm1,fm2)
                console.log("%cresizeClass:      %c'"+resizeBar.resizeClass+"'",fm1,fm2)

                console.group("%cresize bar Edge values:  ... over from top-left of the container...",fm3)
                console.log("%cleftEdge:          %c"+resizeBar.leftEdge+" ",fm1,fm2)

                 if (resizeBar.id === 'orvPaneEl4') {
                   //  debugger
                 } // end if

                console.log("%crightEdge:         %c"+resizeBar.rightEdge+" ",fm1,fm2)
                console.log("%ctopEdge:           %c"+resizeBar.topEdge+" ",fm1,fm2)
                console.log("%cbottomEdge:        %c"+resizeBar.bottomEdge+" ",fm1,fm2)
                console.groupEnd(); // end of resize bar edge values

                let nMax2 = resizeBar.relatedItemsByIndex.length;

                if (nMax2 > 0) {
                    console.group("%crelatedItemsByIndex...("+nMax2+")",fm3)
                    
                    for (let n=0;n<nMax2;n++) {
                        const relatedItm = resizeBar.relatedItemsByIndex[n];
                        const relatedItmObj = relatedItm.obj;
                        console.group("["+n+"] relatedItm    id: '"+relatedItmObj.id+"'")

                        console.log("%cadjustProperty:          %c'"+relatedItm.adjustProperty+"' ",fm1,fm2)
                        console.log("%cposRelatedToResizeBar:   %c'"+relatedItm.posRelatedToResizeBar+"' ",fm1,fm2)
                        console.log("%cobjType:                 %c'"+relatedItm.objType+"' ",fm1,fm2)

                        if (nReportDepth < 6) {
                            relatedItmObj.viewInnards(true)
                        } // end if

                        console.groupEnd(); // end of relatedItm
                    } // next n
                    console.groupEnd(); // end of relatedItemsByIndex values
                } // end if



                if (typeof bNoDrilldown === "undefined") {

                    if (nReportDepth < 6) {
                        console.log("%ccurrentPane:",fm1b)
                        resizeBar.currentPane.viewInnards(true)
                        console.log("%cpreviousPane:",fm1b)
                        resizeBar.previousPane.viewInnards(true)
                    } // end if

                    /*
                    if (resizeBar.extraPanesForCurrent.length > 0) {
                        console.group("extraPanesForCurrent("+resizeBar.extraPanesForCurrent.length+" elements):")
                        let nMax = resizeBar.extraPanesForCurrent.length;
                        for (let n=0;n<nMax;n++) {
                            let paneWrapper = resizeBar.extraPanesForCurrent[n];
                            paneWrapper.pane.viewInnards(true);
                        } // next n
                        console.groupEnd();
                    } else {
                        console.log("%cextraPanesForCurrent(0 elements):",fm4)
                    } // end if/else
                    
                    
                    if (resizeBar.extraPanesForPrevious.length > 0) {
                        console.group("extraPanesForPrevious("+resizeBar.extraPanesForPrevious.length+" elements):")
                        let nMax = resizeBar.extraPanesForPrevious.length;
                        for (let n=0;n<nMax;n++) {
                            let paneWrapper = resizeBar.extraPanesForPrevious[n];
                            paneWrapper.pane.viewInnards(true);
                        } // next n
                        console.groupEnd();
                    } else {
                        console.log("%cextraPanesForPrevious(0 elements):",fm4)
                    } // end if/else
                    */
                } else {
                    console.log("%ccurrentPane:",fm1b)
                    console.log("          🔑id:   '"+resizeBar.currentPane.id+"'")
                    console.log("%cpreviousPane:",fm1b)
                    console.log("          🔑id:   '"+resizeBar.previousPane.id+"'")

                    
                } // end if

                //console.log("      =====================================================")
                console.groupEnd();
                
                nReportDepth = nReportDepth - 1;

            } // end of resizeBar.viewInnards() method!



           /********************************************************************************
             * 
             *   called at the beginning of a resize bar drag.
             * 
             *   #resize_bar_set_start_pos
	         ********************************************************************************/
            resizeBar.setStartPos = function() {
                console.log("resizeBar.setStartPos() method called")
                nStartingLeft = nResizeLeft;
                nStartingRight = nResizeRight;
                nStartingTop = nResizeTop;
                nStartingBottom = nResizeBottom;
            } // end of resizeBar.setStartPos() method




           /********************************************************************************
             * 
             *   Called from:  
             * 
             *   #resize_bar_set_pos_adjust_flag
	         ********************************************************************************/
            resizeBar.setPosAdjustFlag = function(bNewValue) {
                bResizeBarPosAdjusted = bNewValue;
            } // end of resizeBar.setPosAdjustFlag() method



            resizeBar.rollBackLastValues = function() {
                
                if (nResizeLeft !== nStartingLeft) {
                    resizeBar.setNewPos(nStartingLeft, "left")
                } // end if

                if (nResizeRight !== nStartingRight) {
                    resizeBar.setNewPos(nStartingRight, "right")
                } // end if

            } // end of resizeBar.rollBackLastValues() method


           /********************************************************************************
             * 
             *   Called from:   resizeBarDragMove()
             * 
             *   #resize_bar_set_new_pos
	         ********************************************************************************/
            resizeBar.setNewPos = function(nNewPos, sAlign) {
                console.log("resizeBar.setNewPos() called.    nNewPos="+nNewPos+"   sAlign='"+sAlign+"'")

                if (nNewPos < 0) {
                    return false;
                } // end if

                if (sAlign === "left") {
                    nLastResizeLeft = nResizeLeft;
                    nResizeLeft = nNewPos;
                } // end if

                if (sAlign === "right") {
                    nLastResizeRight = nResizeRight;
                    nResizeRight = nNewPos;
                } // end if

                if (sAlign === "top") {
                    nLastResizeTop = nResizeTop;
                    nResizeTop = nNewPos;
                } // end if

                if (sAlign === "bottom") {
                    nLastResizeBottom = nResizeBottom;
                    nResizeBottom = nNewPos;
                } // end if

                resizeBarNd.style[sAlign] = (nNewPos)+"px";
                return true; // success

            }  // end of resizeBar.setNewPos() method



            /********************************************************************************
             * 
             * 
             *    Search for:  "#resize_prop_def"
             * 
             *    #resize_bar_add_another_pane
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
            *  #resize_bar_get_html_markup
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

                // temp:
                s.push(" title="+Q);
                s.push(sResizeBarId);
                s.push(Q);

                s.push(" style=");
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
             * 
             *    #resize_bar_set_dom_ref
	         ********************************************************************************/
            resizeBar.setDomRef = function() {
                console.log("💈 resizeBar.setDomRef() method called. id: '"+sResizeBarId+"'   💈")
                resizeBarNd = document.getElementById(sResizeBarId)
            } // end of setDomRef() method





           /********************************************************************************
            *    called at the beginning of a resize bar drag...
	        ********************************************************************************/            
            resizeBar.setStartPos = function() {
                console.log("called resizeBar.setStartPos() method")
            } // end of resizeBar.setStartPos() method




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
     *  #mouse_events
     * 
     *  #panes_mouse_down
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
     * 
     *   #mouse_events
     * 
     *   #panes_mouse_move
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
     *   #mouse_events
     * 
     *   #panes_mouse_up
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
     * 
     *   #pos_style
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

        
        

        const retVal = {};
        retVal.style = sStyle;
        retVal.left = nLeft;
        retVal.right = nRight;
        retVal.top = nTop;
        retVal.bottom = nBottom;

        return retVal;
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
     * 
     *   #get_val
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
     *   
     *   #resize_bar_drag_begin
     * 
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

        // reset all panel start positions
        const nMax = allPanesByIndex.length;
        for (let n=0;n<nMax;n++) {
            const pane = allPanesByIndex[n];
            pane.setStartPos();
        } // next n

        // now reset all resize bar start positions
        const nMax2 = resizeBarsByIndex.length;
        for (let n=0;n<nMax2;n++) {
            const resizeBar = resizeBarsByIndex[n];
            resizeBar.setStartPos();
        } // next n

    } // end of function resizeBarDragBegin()


	/********************************************************************************
     * 
     *   #resize_bar_drag_end
	 ********************************************************************************/    
    function resizeBarDragEnd(evt) {
        const el = evt.srcElement;

        resizeBarEl.style.backgroundColor = orvRESIZE_BAR_COLOR;

        nResizeStartX = -1;
        nResizeStartY = -1;
        sActiveResizeBarId = "";
        activeResizeBarObj = undefined;
        resizeBarEl = undefined;
    } // end of function resizeBarDragEnd()


	/********************************************************************************
     * 
     *  Called by:   panesMouseMove()
     * 
     *  Only called if a resize bar element is selected!
     *  
     *  #resize_bar_drag_move
	 ********************************************************************************/    
    function resizeBarDragMove(evt) {

        console.groupCollapsed("resizeBarDragMove() called...   pageX="+evt.pageX+"   pageY="+evt.pageY)
        if (evt.buttons !== orvLEFT_MOUSE_BUTTON) {
            // if the Left mouse button is no longer being pressed, then 
            // the user must have taken their hand off the mouse button
            // after leaving the mouse up area. So we want to force an End of the drag operation!
            console.log("mouse button is not down... drag operation is reset!")
            resizeBarDragEnd(evt);
            console.groupEnd(); // odd-ball closing resizeBarDragMove
            return;
        } // end if

        resetAllPaneAdjustFlags();

        const el = evt.srcElement;

        const relatedItemsByIndex = activeResizeBarObj.relatedItemsByIndex;

        let nOffsetX = evt.pageX - nResizeStartX;
        let nOffsetY =  nResizeStartY - evt.pageY;
        let nNewValue;
        let sPosRelatedToResizeBar;
       
        // =====================================
        //  Selected Resize Bar is re-positioned:
        // =====================================        
        if (sResizeAlign === "top") {            
            nNewPos = nBarStartPos+nOffsetY;
        } // end if

        if (sResizeAlign === "bottom") {
            nNewPos = nBarStartPos+nOffsetY;
        } // end if

        if (sResizeAlign === "left") {
            nNewPos = nBarStartPos+nOffsetX;
        } // end if

        if (sResizeAlign === "right") {
            nNewPos = nBarStartPos-nOffsetX;
        } // end if

        activeResizeBarObj.setNewPos(nNewPos, sResizeAlign);

//debugger
        // =====================================
        //  now adjust the proper panes
        //  and related resize bars...
        // =====================================
        const nMax = relatedItemsByIndex.length;
        console.log("relatedItemsByIndex count: "+nMax)
        for (let n=0;n<nMax;n++) {
            const relatedItem = relatedItemsByIndex[n];
            const relatedItemObj = relatedItem.obj;

            if (relatedItem.adjustProperty !== "") {
                sPosRelatedToResizeBar = relatedItem.posRelatedToResizeBar; // NOT in relatedItemObj !

                nNewValue = 0;

                if (relatedItem.adjustProperty === "width") {
                    if (sPosRelatedToResizeBar === "left") {
                        nNewValue = relatedItemObj.startingWidth+nOffsetX;                    
                    } else {
                        // below would be 'right' then! ...
                        nNewValue = relatedItemObj.startingWidth-nOffsetX; 
                    } // end if/else

                    relatedItemObj.setNewWidth(nNewValue);

                } else if (relatedItem.adjustProperty === "height") {
                    if (sPosRelatedToResizeBar === "above") {
                        nNewValue = relatedItemObj.startingHeight-nOffsetY;
                    } else {
                        nNewValue = relatedItemObj.startingHeight+nOffsetY;
                    } // end if/else

                    relatedItemObj.setNewHeight(nNewValue);

                } else {
                    if (relatedItem.adjustProperty === "bottom") {
                        nNewValue = relatedItemObj.startingBottom+nOffsetY;
                    } // end if

                    if (relatedItem.adjustProperty === "top") {
                        nNewValue = relatedItemObj.startingTop+nOffsetY;
                    } // end if

                    if (relatedItem.adjustProperty === "left") {
                        nNewValue = relatedItemObj.startingLeft+nOffsetX;
                    } // end if

                    if (relatedItem.adjustProperty === "right") {
                        nNewValue = relatedItemObj.startingRight-nOffsetX; 
                    } // end if

                    relatedItemObj.setNewPos(nNewValue, relatedItem.adjustProperty);
                } // end if / else if / else if / else

                relatedItemObj.setPosAdjustFlag(true);

            } // end if (relatedItem.adjustProperty !== "") 

        } // next n
        
        // =====================================
        // =====================================

        console.groupEnd(); // resizeBarDragMove() called

    } // end of function resizeBarDragMove()


 } // end of constructor function OrvPanes()
 
