<!DOCTYPE html>
<html lang="en">

    <head>
            <?php

            /*********************************************************************
             This File:
                index.php
                
                
            For now this test page can be run using MAMP at this URL:

                http://orvilles-imac.local:8888/paraC/paneTest.php
                
            

            *********************************************************************/

            $time = microtime(true);

            $datetime = new DateTime();
            $datetime->setTimestamp($time);
            $microSecs = $datetime->format('H:i:s:U');
            ?>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Pane/Panel Test Page</title>
    </head>
    <body>
        <style>
            #mcontainer {
                box-sizing: border-box;
                position:absolute;
                background:lightgreen;
                left:0px;
                right:0px;
                top:60px;
                bottom:0px;
                overflow:hidden;
            }
        </style>
        <div id="mcontainer">jello! The content will go in here.</div>
        <script src="./js/panes.js?r=<?= $microSecs ?>"></script>
        <script src="./js/paneTest.js?r=<?= $microSecs ?>"></script>
    </body>
  </html>