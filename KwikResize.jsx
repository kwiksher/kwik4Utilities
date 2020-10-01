var projFolder = "~/Documents/Kwik";
var _Type = "New Universal"; 


/*
Ultimate Config (@4x)
    1920
    1280

iPad Mini/Universal
    1024
    768

    1280/768 = 1.6667

    (1920 - 1024*1280/768)/2 = 106.6667
    768*1280/768 = 1280

    X:=(X-1024/2)*1280/768 + 1920/2
    Y:=(Y-768/2)*1280/768 + 1280/2

iPad Air
New Universal
    2048
    1536

    1280/1536 = 0.8333

iPad Pro
    2732
    2048

iPhone X not in Kwik3
    2772
    1440
*/


var SPRITE_CONV = false;

var deviceMap = {}
deviceMap["iPad Mini"]     = {"width": 1024, "height": 768};
deviceMap["New Universal"] = {"width": 2048, "height": 1536};
deviceMap["iPad Pro"]      = {"width": 2732, "height": 2048};
deviceMap["Universal"]     = deviceMap["iPad Mini"];
deviceMap["iPad Air"]      = deviceMap["New Universal"];

//loops each page
var percent;
var _W;
var _H;

function initSize(type){
    percent = 1280/deviceMap[type].height;
    _W     = deviceMap[type].width * percent;
    _H     = deviceMap[type].height * percent;    
}

function kUltimateConfig(x, y){
    var w = 480;
    var h = 320;
    var mX = 1920/2 + (x*0.25 - w*0.5);
    var mY = 1280/2 + (y*0.25 - h*0.5);
    return [mX, mY];
}


function kPos(aXML, nameX, nameY){
    if (aXML[nameX].length() > 0){
        aXML[nameX] = Math.floor((parseFloat (aXML[nameX])-deviceMap[_Type].width/2) * percent+ 1920/2);
    }
    if (aXML[nameY].length() > 0){
        aXML[nameY] = Math.floor( (parseFloat (aXML[nameY])-deviceMap[_Type].height/2) * percent + 1280/2);
    }
}

function kSize(aXML, name) {
    try{
        if (typeof aXML[name] !== undefined && aXML[name].length() > 0){
            aXML[name] = Math.floor(parseFloat (aXML[name])*percent);
        }else{
           // alert(name);
        }
    }catch(e){
        //alert(name);
    }
 }


 function selectDialog(){
    var msgOpenDlg = { en: "Select .kwk file", jp: ".kwkファイルを選択してください" }
    $.localize = true;
    //
    var f;
    var fol = File(projFolder);
    if (File.fs=="Windows") {
        f = String(fol.openDlg (msgOpenDlg, 'Kwik: *.kwk', 0));
    }else{
        f = String(fol.openDlg (msgOpenDlg));
    }
    return f;
 }

function KwikResize(f){
    //
    var c;
    var projFile = File(f);
    projFile.encoding = "UTF-8";
    projFile.open("e","TEXT","????");
    c = projFile.read();
    projFile.close();

    projFile.copy(f+".bak");

    //
    var kXML = new XML (c);
    
    //Settings
    if (String(kXML.settings.device) == "Ultimate Config"){
        return;
    }
    
    _Type = kXML.settings.device;

    initSize(_Type);

    kXML.settings.device = "Ultimate Config";
    kXML.settings.width = 1920;
    kXML.settings.height = 1280;
    
    kSize(kXML.settings, "thumH");
    kSize(kXML.settings, "thumW");
    kSize(kXML.settings, "swipeSpace");
    kPos(kXML.settings, "adX", "adY");


    for (var i=0;i<=kXML.pages.children().length()-1;i++) {
        var pXML = kXML.pages.page[i];
        //alert(pXML.name);
        //page properties
        kSize(pXML, "swipSpacer");
      
        //layer properties
        for (var ii=0;ii<=pXML.layer.length()-1;ii++) {
            var layer = pXML.layer[ii];
            kPos(layer, "randXStart", "randYStart");
            kPos(layer, "randXEnd", "randYEnd");
        }

        for (var ii=0;ii<=pXML.replacement.length()-1;ii++) {
            var replacement = pXML.replacement[ii];
        
            //spritesheet
            if (SPRITE_CONV){
                kSize(replacement, "frameWidth");
                kSize(replacement, "frameHeight");
                kSize(replacement, "sheetWidth");
                kSize(replacement, "sheetHeight");
            }

            //video
            //web
            //vector
            //map
            kSize(replacement, "width");  
            kSize(replacement, "height"); 

            //Multipiler
            kPos(replacement,"startX","startY")
            kPos(replacement,"endX", "endY")
            kPos(replacement,"fixX","fixY")

            //Dynamic Text
            //Count Down
            kSize(replacement, "offset"); 
            //Text Replacement
            kSize(replacement, "vOffset");
            kSize(replacement, "hOffset");
            kSize(replacement, "hPad");
        }

        //sync audio & text
        for (var ii=0;ii<=pXML.sync.length()-1;ii++) {
            var sync = pXML.sync[ii];
            kSize(sync, "padding");
            kSize(sync, "offset");
        }
        //Particles need to edit json

        //Animation
        for (var ii=0;ii<=pXML.anim.length()-1;ii++) {
            var anim = pXML.anim[ii];
            kPos(anim, "endX", "endY");
            kSize(anim, "breadWidth");
            kSize(anim, "breadHeight");
            kPos(anim, "randXStart", "randYStart");
            kPos(anim, "randXEnd", "randYEnd");
        }

        //Drag
        for (var ii=0;ii<=pXML.drag.length()-1;ii++) {
            var drag = pXML.drag[ii];
            kPos(drag, "boundsXStart", "boundsYStart");
            kPos(drag, "boundsXEnd", "boundsYEnd");
            kSize(drag, "dropBounds");
        }
        
        //Swipe
        for (var ii=0;ii<=pXML.swipe.length()-1;ii++) {
            var swipe = pXML.swip[ii];
            kSize(swipe, "spacer");
            kSize(swipe, "limitAngle");
        }

        //Scroll
        for (var ii=0;ii<=pXML.scroll.length()-1;ii++) {
            var scroll = pXML.scroll[ii];
            kSize(scroll, "memberW");
            kSize(scroll, "manualW");
            kSize(scroll, "manualH");
            kSize(scroll, "manualSW");
            kSize(scroll, "manualSH");
            kPos(scroll, "manualTOP", "manualLEFT");
        }
        
        //Canvas
        for (var ii=0;ii<=pXML.canvas.length()-1;ii++) {
            var canvas = pXML.canvas[ii];
            kSize(canvas, "height");
            kSize(canvas, "width");
            kSize(canvas, "brushSize");
        }

        //Joints
        for (var ii=0;ii<=pXML.joint.length()-1;ii++) {
            var joint = pXML.joint[ii];
            kPos(joint, "pointX" , "pointY");
            kPos(joint, "axisX" , "axisY");
            kPos(joint, "bX" , "bY");
            kPos(joint, "rotationX" , "rotationY");
            kPos(joint, "anchorX" , "anchorY");
            kPos(joint, "anchorBX" , "anchorBY");
        }

        //Action
        for (var ii=0;ii<=pXML.trigger.length()-1;ii++) {
            var aXML = pXML.trigger[ii];
            for (var iii=0;iii<=aXML.action.length()-1;iii++) {
                var action = aXML.action[iii]; 
                //canvs brush
                kSize(action, "size");
                //edit image
                kPos(action, "moveX", "moveY");
            }
        }

        //Button
        for (var ii=0;ii<=pXML.button.length()-1;ii++) {
            var aXML = pXML.button[ii];
            for (var iii=0;iii<=aXML.action.length()-1;iii++) {
                var action = aXML.action[iii]; 
                //canvs brush
                kSize(action, "size");
                //edit image
                kPos(action, " moveX", "moveY");
            }
        }
    }

    //save XML
    kXML.normalize()
    projFile = File(f)
    projFile.encoding = "UTF-8";
    projFile.open("w","TEXT","????");
    projFile.write(kXML);
    projFile.close();
}

var target       = 0; // 0 == all pages

var resizePSD = function(f){

    var c;
    var projFile = File(f);
    projFile.encoding = "UTF-8";
    projFile.open("e","TEXT","????");
    c = projFile.read();
    projFile.close();

    //
    var kXML = new XML (c);
    var parse = function (i){
        var docSel = projFolder+"/" + kXML.settings.name + "/"+String(kXML.pages.page[i].fileName);
        open(File(docSel));
        
/*
        var doc = activeDocument;
         // Loop through every layer...
        for( var i = 0 ; i < doc.artLayers.length; i++ ){
            var activeLayer = doc.artLayers.getByName( doc.artLayers[ i ].name  );
            // Save original ruler units
            var orUnits = app.preferences.rulerUnits;
            app.preferences.rulerUnits = Units.PERCENT;
            activeLayer.resize( percent, percent, AnchorPosition.MIDDLECENTER );
            app.preferences.rulerUnits = orUnits;
        }
*/
        activeDocument.resizeImage(UnitValue(_W,"px"),UnitValue(_H,"px"),null,ResampleMethod.BICUBIC);
        activeDocument.resizeCanvas(1920, 1280);
        activeDocument.close(SaveOptions.SAVECHANGES);
    }

    if (target == 0){
        for (var i =0; i<kXML.pages.children().length(); i ++) {
            parse(i);
        }
    }else{
        parse(target-1);
    }
}


alert("This script converts Kwik3 to Kwik4 Universal Config. Please select a .kwk file");
initSize(_Type);
var f = selectDialog();
KwikResize(f);
resizePSD(f)
alert("Done. Opne the .kwk with Kwik4")
