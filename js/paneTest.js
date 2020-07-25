const orvPanes = new OrvPanes('mcontainer');
let paneLeft,paneBottom,paneRight,paneViewport;

function pageSetup() {
    const Q = '"';
    let s = [];

    orvPanes.logResizeNumbers = true; // debugging feature... false to turn off!
    
    paneLeft = orvPanes.addPane({caption:"Design", paneAlignment: orvPANE_ALIGN_LEFT, 
                                 paneContent:"Hello There! This is the <b>first pane</b>"});
    
    
    paneBottom = orvPanes.addPane({caption:"Whatsoever", paneAlignment: orvPANE_ALIGN_BOTTOM, paneContent:"right pane"});

    
    paneRight = orvPanes.addPane({caption:"Properties", paneAlignment: orvPANE_ALIGN_RIGHT, paneContent:"right pane"});

    // always do last:
    paneViewport = orvPanes.addPane({caption:"Viewport",  paneContent:"This is the viewport...",
    paneAlignment:orvPANE_ALIGN_ALL, viewPortPane: true, showTitleBar: false});

    orvPanes.showPanes();  // call after all the panes have been created

    // LEFT CONTENT
    let sContent = "Pane content updated after render";
    s = [];
    s.push("<br>")
    s.push("<button onclick="+Q)
    s.push("viewInnards('paneLeft')")
    s.push(Q)
    s.push(">View This Pane's Innards</button>")
    s.push("<br>")
    s.push("pane.id="+paneLeft.id)
    sContent = sContent + s.join("")
    paneLeft.addContent({paneContent:sContent});


    // BOTTOM CONTENT
    s = [];
    s.push("Hello There! This is the <b>second pane</b>")
    s.push("<br>")
    s.push("<button onclick="+Q)
    s.push("viewInnards('paneBottom')")
    s.push(Q)
    s.push(">View This Pane's Innards</button>")
    s.push("<hr>")
    s.push("orvPanes.logResizeNumbers = "+orvPanes.logResizeNumbers)
    s.push("<br>")
    s.push("pane.id="+paneBottom.id)
    paneBottom.addContent({paneContent:s.join("")});


    // RIGHT CONTENT
    s = [];
    s.push("Hello There! This is the <b>third pane</b>")
    s.push("<br>")
    s.push("<button onclick="+Q)
    s.push("viewInnards('paneRight')")
    s.push(Q)
    s.push(">View This Pane's Innards</button>")
    s.push("<hr>")
    s.push("orvPanes.logResizeNumbers = "+orvPanes.logResizeNumbers)
    s.push("<br>")
    s.push("pane.id="+paneRight.id)
    paneRight.addContent({paneContent:s.join("")});
    
    
    // VIEWPORT CONTENT

    sContent = ""
    s = [];
    s.push("<div style=")
    s.push(Q)
    s.push("width:98.5%;margin:4px;padding:4px;background:lightblue;border:solid blue 1px;")
    s.push(Q)
    s.push(">Well Hello There!  -- I'm here to show you if this <i>pane</i> is being resized properly on horizontal plane!")
    s.push("</div>")

    s.push("<div style=")
    s.push(Q)
    s.push("width:30px;background:lightblue;border:solid blue 1px;position:absolute;left:2px;top:72px;bottom:2px;")
    s.push(Q)
    s.push(">")
    s.push("</div>")

    sContent = sContent + s.join("")

    sContent = sContent + "<h3>This is my contrived viewport!</h3>"

    sContent = sContent + "<div style="+Q;
    sContent = sContent + "position:absolute;"
    sContent = sContent + "left:70px;"
    sContent = sContent + "top:70px;"
    sContent = sContent + "bottom:0px;"
    sContent = sContent + "width:3000px;"
    //sContent = sContent + "height:650px;"
    sContent = sContent + "background:lightyellow;"
    sContent = sContent + "overflow:auto;"
    sContent = sContent + Q;
    sContent = sContent + ">"

    

    s = [];

    // fine 'as is' ... for now...
    s.push("pane.id="+paneViewport.id)
    s.push("<hr>")

    s.push("<button onclick="+Q)
    s.push("orvPanes.viewInnards()")
    s.push(Q)
    s.push(">View <b>orvPanes</b>' Innards</button>")

    s.push("<hr>")

    

    s.push("<hr>")
    s.push("<button onclick="+Q)
    s.push("viewInnards('paneViewport')")
    s.push(Q)
    s.push(">View the Viewport Pane's Innards</button>")
    sContent = sContent + s.join("")

    sContent = sContent +"<ul>"
    sContent = sContent +"<li>paneLeft.id='"+paneLeft.id+"'";
    sContent = sContent +"<ul>"
    sContent = sContent +"<li>top="+paneLeft.top+"</li>"
    sContent = sContent +"<li>bottom="+paneLeft.bottom+"</li>"
    sContent = sContent +"<li>left="+paneLeft.left+"</li>"
    sContent = sContent +"<li>right="+paneLeft.right+"</li>"
    sContent = sContent +"</ul>"
    sContent = sContent +"</li>"
    sContent = sContent +"<li>paneBottom.id='"+paneBottom.id+"'";
    sContent = sContent +"<ul>"
    sContent = sContent +"<li>top="+paneBottom.top+"</li>"
    sContent = sContent +"<li>bottom="+paneBottom.bottom+"</li>"
    sContent = sContent +"<li>left="+paneBottom.left+"</li>"
    sContent = sContent +"<li>right="+paneBottom.right+"</li>"
    sContent = sContent +"</ul>"
    sContent = sContent +"</li>"
    sContent = sContent +"<li>paneRight.id='"+paneRight.id+"'";
    sContent = sContent +"<ul>"
    sContent = sContent +"<li>top="+paneRight.top+"</li>"
    sContent = sContent +"<li>bottom="+paneRight.bottom+"</li>"
    sContent = sContent +"<li>left="+paneRight.left+"</li>"
    sContent = sContent +"<li>right="+paneRight.right+"</li>"
    sContent = sContent +"</ul>"
    sContent = sContent +"</li>"
    sContent = sContent +"<li>paneViewport.id='"+paneViewport.id+"'";
    sContent = sContent +"<ul>"
    sContent = sContent +"<li>top="+paneViewport.top+"</li>"
    sContent = sContent +"<li>bottom="+paneViewport.bottom+"</li>"
    sContent = sContent +"<li>left="+paneViewport.left+"</li>"
    sContent = sContent +"<li>right="+paneViewport.right+"</li>"
    sContent = sContent +"</ul>"
    sContent = sContent +"</li>"
    sContent = sContent +"</ul>"

    sContent = sContent +"<hr>"

    const resizeBarsByIndex = orvPanes.resizeBarsByIndex;
    const nMax = resizeBarsByIndex.length
    sContent = sContent + "Resize Bar Count: "+nMax;
    
    sContent = sContent +"<ul>"

    for(let n=0;n<nMax;n++) {
        const resizeBar = resizeBarsByIndex[n];
        sContent = sContent +"<li>resizeBar.id='"+resizeBar.id+"'";
        sContent = sContent +"<ul>"
        sContent = sContent +"<li>style='"+resizeBar.style+"'</li>"
        sContent = sContent +"<li>align='"+resizeBar.align+"'</li>"
        sContent = sContent +"<li>resizeClass='"+resizeBar.resizeClass+"'</li>"
        //previousPane
        sContent = sContent +"<li>previousPane.id='"+resizeBar.previousPane.id+"'</li>";
        //currentPane
        sContent = sContent +"<li>currentPane.id='"+resizeBar.currentPane.id+"'</li>";
        sContent = sContent +"</ul>"
        sContent = sContent +"</li>"
    } // next n

    sContent = sContent +"</ul>"

    sContent = sContent +"</div>"
    paneViewport.addContent({paneContent:sContent});
    //alert("done running pageSetup()")
} // end of function pageSetup()


function viewInnards(sPaneObjName) {
    let paneObj = paneLeft;

    if (sPaneObjName === "paneRight") {
        paneObj = paneRight;
    } // end if

    if (sPaneObjName === "paneTop") {
        paneObj = paneTop;
    } // end if

    if (sPaneObjName === "paneBottom") {
        paneObj = paneBottom;
    } // end if

    if (sPaneObjName === "paneViewport") {
        paneObj = paneViewport;
    } // end if

    paneObj.viewInnards()

} // end of function viewInnards()


window.addEventListener("load", pageSetup);	
