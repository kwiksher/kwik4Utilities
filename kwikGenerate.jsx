var target       = 0; // 0 == all pages, or input the page number
// 
var timeout = 30;
//
var projName = ""; // "" will open a file dialog
//var projName = "HelloWorld"; // "" will open a file dialog
//
var projFolder   = "~/Documents/Kwik";
var bPower2check = true;
//
var  createJson = function(projFile, images, time){
    var jsonFile = File(projFolder+"/kwikPublish.json");
    jsonFile.encoding = "UTF-8";
    jsonFile.open("w","TEXT","????");
    jsonFile.write(JSON.stringify({images:images, projFile:projFile, time:time, target:target}));
    jsonFile.close();
}

function getAbsolutePath(path){
    var absolutePath = File(path).getRelativeURI("/");
    absolutePath = absolutePath.replace(new RegExp ("%20","g"), " ");
    if (File.fs=="Windows") {
        absolutePath = absolutePath.replace("/c/", "c:/");
        absolutePath = absolutePath.replace(new RegExp("/", "g"), "\\");
    }
    return absolutePath;
}


var createBat = function(files){

    var ps_name = app.path.fsName + "\\Photoshop.exe";
    var gn_name = app.path.fsName + "\\Presets\\Scripts\\generate.jsx";

    //temp.jsx
    var sc_name = Folder.temp.fsName + "\\" + "temp.jsx";
    var sc_file = new File(sc_name);
    sc_file.encoding = "UTF8";
    sc_file.open("w");
    sc_file.writeln("while (documents.length > 1) documents[0].close(SaveOptions.DONOTSAVECHANGES)");
    sc_file.writeln("$.evalFile(" + gn_name.toSource() + ")");
    sc_file.close();

    if (files)   {
        var KwikGenerate = "KwikPublish.jsx"
        var bat_name = "~\\Documents\\Kwik\\" + "temp.bat";
        var bat_file = new File(bat_name);
        bat_file.encoding = "UTF8";
        bat_file.open("w");

        bat_file.writeln("@echo off");
        for (var i = 0; i < files.length; i++){
            bat_file.writeln();
            bat_file.writeln("set /a count=0");
            bat_file.writeln("\"" + ps_name + "\"" + " " + "\"" + getAbsolutePath(files[i].fsName) + "\"");
            bat_file.writeln("\"" + ps_name + "\"" + " " + "\"" + sc_name + "\"");
            bat_file.writeln(":" + files[i].psdName + "_check");
            bat_file.writeln("set /a count=count+1");
            bat_file.writeln("timeout 1 /nobreak");
            bat_file.writeln("set /a n=0");
            bat_file.writeln("for  %%A in (" + getAbsolutePath(files[i].assetDir) + '\\*) do ( if exist %%A (set /a n=n+1) )');
            if (i < files.length-1){
                bat_file.writeln("@echo %n%/" + files[i].imageCount*3 + " in %count% sec for " + files[i].psdName);
                bat_file.writeln("if %n% ==" + files[i].imageCount*3 + " goto " + files[i+1].psdName);
                bat_file.writeln("if %count% ==" + timeout + " goto " + files[i+1].psdName);
                bat_file.writeln("goto " + files[i].psdName + "_check");
                bat_file.writeln(":" + files[i+1].psdName);
            }else{
                bat_file.writeln("@echo %n%/" + files[i].imageCount*3 + " in %count% sec for " + files[i].psdName);
                bat_file.writeln("if %n% ==" + files[i].imageCount*3 +" goto exit");
                bat_file.writeln("if %count% ==" + timeout + " goto exit");
                bat_file.writeln("goto " + files[i].psdName + "_check");
                bat_file.writeln(":exit");
            }
        }
        bat_file.writeln("\"" + ps_name + "\"" + " " + "\"" + getAbsolutePath(projFolder + "/" + KwikGenerate) + "\"");
        bat_file.close();
        bat_file.execute();
    }
}

// https://stackoverflow.com/questions/3504945/timeout-command-on-mac-os-x/21118126

var createCommand = function(files){

    var ps_name = 'open  "/Applications/Adobe Photoshop CC 2019/Adobe Photoshop CC 2019.app"';
    var oa_name1 = 'osascript  -e "tell application \\"'
    var oa_name2 = '\\" to do javascript file \\"' 
    var oa_name3 = '\\"" > /dev/null'
    var gn_name = app.path.fsName + "/Presets/Scripts/generate.jsx";

    //temp.jsx
    var sc_name = Folder.temp.fsName + "/" + "temp.jsx";
    var sc_file = new File(sc_name);
    sc_file.encoding = "UTF8";
    sc_file.open("w");
    sc_file.writeln("while (documents.length > 1) documents[0].close(SaveOptions.DONOTSAVECHANGES)");
    sc_file.writeln("$.evalFile('" + getAbsolutePath(gn_name) + "')");
    sc_file.close();

    if (files)   {
        var KwikGenerate = "KwikPublish.jsx"
        var cmd_name = "~/Documents/Kwik/" + "temp.command";
        var cmd_file = new File(cmd_name);
        cmd_file.encoding = "UTF8";
        cmd_file.lineFeed = "unix";
        cmd_file.open("w");

        cmd_file.writeln("#!/bin/bash");
        for (var i = 0; i < files.length; i++){
            cmd_file.writeln();
            cmd_file.writeln("count=0");
            cmd_file.writeln(ps_name  + " " + "\"" + getAbsolutePath(files[i].fsName) + "\"");
            cmd_file.writeln(oa_name1  + 'Adobe Photoshop CC 2019' + oa_name2 + getAbsolutePath(sc_name) + oa_name3);
            cmd_file.writeln(oa_name1  + 'Adobe Photoshop CC 2019' + oa_name2 + '/Applications/Adobe Photoshop CC 2019/Presets/Scripts/generate.jsx' + oa_name3);
            cmd_file.writeln("while :");
            cmd_file.writeln("do");
            cmd_file.writeln("  sleep 1");
            cmd_file.writeln("  count=$(($count+1))");
            cmd_file.writeln("  if [ -e \""+getAbsolutePath(files[i].assetDir) +"\" ]; then");
            cmd_file.writeln("     n=$(find \"" + getAbsolutePath(files[i].assetDir) + "\" -type f | wc -l)");
            cmd_file.writeln("     echo $n/24 in $count sec for "  + files[i].psdName);
            cmd_file.writeln("     if [ $n = " + files[i].imageCount*3 + " ]; then");
            cmd_file.writeln("        break");
            cmd_file.writeln("     fi");
            cmd_file.writeln("   fi");
            cmd_file.writeln("   if [ $count = " + timeout + " ]; then");
            cmd_file.writeln("      break");
            cmd_file.writeln("   fi");
            cmd_file.writeln("done");
        }

        cmd_file.writeln(oa_name1  + 'Adobe Photoshop CC 2019' + oa_name2 + getAbsolutePath(projFolder + "/" + KwikGenerate) + oa_name3);
        cmd_file.close();
        cmd_file.execute();
    }
}

var doPublish = function(){
    var f = projName;
    if (projName == ""){
        var msgOpenDlg = { en: "Select .kwk file", jp: ".kwkファイルを選択してください" }
        $.localize = true;
        //
        var fol = File(projFolder);
        if (File.fs=="Windows") {
            f = String(fol.openDlg (msgOpenDlg, 'Kwik: *.kwk', 0));
        }else{
            f = String(fol.openDlg (msgOpenDlg));
        }
    }else{
        f = projFolder + "/" + projName + "/" + projName + ".kwk";
    }
    //
    var startTime = new Date();
    //
    var projFile = File(f);
    projFile.encoding = "UTF-8";
    projFile.open("e","TEXT","????");
    var c = projFile.read();
    projFile.close();
    //
    var kXML = new XML (c);
    var images = [];
    var files = [];
    var previous;

    //loops each page
    var parse = function (i){
        var pageNum = kXML.pages.page[i].number;
        var docSel = projFolder+"/" + kXML.settings.name + "/"+String(kXML.pages.page[i].fileName);
        open(File(docSel));
        //
        var imageCount = 0;
        for (var ii=0;ii<= activeDocument.layers.length-1;ii++) {
            var currentLayer = activeDocument.layers[activeDocument.layers.length-ii-1];
            activeDocument.activeLayer = activeDocument.layers.getByName(String(currentLayer.name));
            var layer = activeDocument.activeLayer;
            var layerName = removeSpaces(rename(layer.name));

            //checks for group positioning (layer name will start with -)  OR layers to not be rendered (also starts with -)
            if (layerName.substr(0,1) != "-" ) {
                //check for power of 2 incompatibilities
                if(bPower2check) {
                    //var renderAs = String(layerXML.renderAs)
                    //if (renderAs == layerName || renderAs == "") {
                        //render as enabled for
                        power2check(layer);
                    //}
                }
                //
                var o = {};
                o.name = layerName;
                o.jpg  = false;
                o.shared = false;
                o.pageNum = String(kXML.pages.page[i].number);
                o.psdName = String(kXML.pages.page[i].fileName);
                o.psdName = o.psdName.substring(0, o.psdName.length-4);
                //
                activeDocument.activeLayer.name = layerName + "@4x.png, 50% " + layerName + "@2x.png, 25% " + layerName + ".png";
                //
                if (kXML.pages.page[i].layer.length() > 0 ){
                    var layerXML = kXML.pages.page[i].layer.(@id==layerName);
                    if (String(layerXML.jpg)=="true") {
                        o.jpg = true;
                        var quality = layerXML.jpgQuality;
                        if (String(quality)=="") {
                            quality= 6;
                        }
                        activeDocument.activeLayer.name = layerName + "@4x.jpg"+quality+", 50% " + layerName + "@2x.jpg"+quality+", 25% " + layerName + ".jpg"+quality
                    }
                    if (String(layerXML.shared)=="true") {
                        o.shared = true;
                    }
                }
                images.push(o);
                imageCount= imageCount + 1;
            }
        }
        var aFile = {}
        aFile.fsName = docSel.substring(0, docSel.length-4) + "_.psd";
        aFile.psdName = String(kXML.pages.page[i].fileName);
        aFile.assetDir = docSel.substring(0, docSel.length-4) + "_-assets";
        aFile.imageCount = imageCount;
        files.push(aFile);
        activeDocument.saveAs(new File(aFile.fsName), PhotoshopSaveOptions);
        activeDocument.close(SaveOptions.DONOTSAVECHANGES);
    }

    if (target == 0){
        for (var i =0; i<kXML.pages.children().length(); i ++) {
            parse(i);
        }
    }else{
        parse(target-1);
    }

    var endTime = new Date();
    createJson(String(kXML.settings.name), images, Math.round((endTime.getTime() - startTime.getTime())/1000)  );

    if (File.fs=="Windows") {
        createBat(files);
    }else{
        createCommand(files);
    }
}

function checkwords (layerName, i) {
    //Lua reserved words
     var l_words = "return, false, local, audio, group, sprite, function, clean, director, end, widget, gtween, director, btween, json, module, if, for, while, print, and, break, do, else, elseif, in, nil, not, or, repeat, then, true, until, next, previous, bang, "
    //check if layer has a reserved word name
    if (l_words.search(layerName)>=0) {
        var d = new Date();
        var camNum = String(d.getTime());
        var newName = layerName+"_"+camNum.substr(camNum.length-3,camNum.length);
        alert('Layer name "'+layerName+'" is a reserved word and cannot be used. Changing the layer name to "'+newName+'"')
        layerName = newName;
    }
    return layerName;
}

function power2check(layer){
    if (String(layer.kind) != "LayerKind.TEXT") {
        //get image dimensions and check power of 2
        //add code for positioning
        var elX = layer.bounds[0].value;
        var elY = layer.bounds[1].value;
        var elW = layer.bounds[2].value - elX;
        var elH = layer.bounds[3].value - elY;
        var cW = elW % 2
        var cH = elH % 2
        //power2fix
        if (cW !=0 || cH !=0) {
            //should be resized to avoid blur when auto-resized for smaller devices
            //new code (based on kilopop code) to auto-resize the layer
            function isOdd( x ){
                return x==x+0 && Boolean(x % 2);
            }
            var newWidth = isOdd(Number(elW)) ? elW+1:elW;
            var newHeight = isOdd(Number(elH)) ? elH+1:elH;
            var scaleX = newWidth / elW * 100;
            var scaleY = newHeight / elH * 100;
            //
            layer.resize(scaleX, scaleY, AnchorPosition.MIDDLECENTER);
        }
    } //if LayerKind
}

function callGenerator(){

    var generatorDesc = new ActionDescriptor();
    try {
    generatorDesc.putString (app.stringIDToTypeID ("name"), "my-menu-name");
    // Example of additional parameter passed to the node.js code:
    generatorDesc.putString (app.stringIDToTypeID ("sampleAttribute"), "moreInfo" );
    var returnDesc = executeAction (app.stringIDToTypeID ("generateAssets"), generatorDesc, DialogModes.NO);
    }catch( e ) { alert(); }
  /*
    try {
        var r = new ActionReference();
        r.putProperty( charIDToTypeID( "Prpr" ), stringIDToTypeID( "generatorSettings" ) );
        r.putEnumerated( charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );

        var d = executeActionGet(r);

        var generatorSettings = d.getObjectValue(stringIDToTypeID("generatorSettings"));
        var generator_45_assets = generatorSettings.getObjectValue(stringIDToTypeID("generator_45_assets"));
        var json = generator_45_assets.getString(stringIDToTypeID("json"));

        generator_45_assets.putString(stringIDToTypeID("json"), "{\"enabled\":false}");
        generatorSettings.putObject(stringIDToTypeID("generator_45_assets"), stringIDToTypeID("generator_45_assets"), generator_45_assets);

        var d = new ActionDescriptor();
        d.putReference( charIDToTypeID( "null" ), r );
        d.putObject( charIDToTypeID( "T   " ), charIDToTypeID( "null" ), generatorSettings );

        executeAction( charIDToTypeID( "setd" ), d, DialogModes.NO );
        }
    catch(e) { alert(e); }
*/
}

function removeSpaces(temp) {
 temp = temp.split(' ').join('_');
 temp = temp.split('%20').join('_');
 return (temp);
}

function rename (temp) {
    if (temp.substr(0,1) != "-") { //if layer starts with "-" or "*" DO NOT RENDER it
        temp =  temp.replace(/[^a-zA-Z 0-9]_+?/g,'');
        //temp = temp.substring(0,15)
        temp = temp.split('(').join('');
        temp= temp.split(')').join('');
        temp = temp.split('.').join('');
        temp = temp.split(',').join('');
        temp= temp.split('-').join('');
        temp= temp.split(':').join('');
        temp= temp.split(';').join('');
        temp= temp.split(' ').join('_');
        temp= temp.split('*').join('');
        temp= temp.split('&').join('');

        temp= temp.split('á').join('a');
        temp= temp.split('é').join('e');
        temp= temp.split('í').join('i');
        temp= temp.split('ó').join('o');
        temp= temp.split('ú').join('u');

        temp= temp.split('Á').join('A');
        temp= temp.split('É').join('E');
        temp= temp.split('Í').join('I');
        temp= temp.split('Ó').join('O');
        temp= temp.split('Ú').join('U');

        temp= temp.split('ã').join('a');
        temp= temp.split('õ').join('o');
        temp= temp.split('ñ').join('n');

        temp= temp.split('ü').join('u');
        temp= temp.split('ö').join('o');

        temp= temp.split('¿').join('');
        temp= temp.split('?').join('');
        temp = temp.split('!').join('');
        temp = temp.split('.').join('');

        temp = temp.split('>').join('zz');
        temp = temp.split('<').join('zz');

        temp = temp.replace(/(\r\n|\n|\r)/gm,"");

        //remove numbers if they exist in the beginning of the layer name
        for (var s=0;s<=temp.length-1;s++) {
            if (String(isNaN(temp.substring(0,1))) == "false" || temp.substring(0,1)=="_") { //it is a number
                temp = temp.substring(1,15)
            } else {
                break
            }
        }
        temp = temp.substring(0,15);

    }
    return(temp);
}

var JSON;
if (!JSON) {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

doPublish();
