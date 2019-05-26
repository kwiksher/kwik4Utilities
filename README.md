1. download the script file to ~/Documents/Kwik
1. open photoshop
  1. File > Scripts > Browse..
  1. Select the script

then a file dialog appears to select a .kwk file of your project.

## KwikResize

KwikResize.jsx translates the coordinate [x,y] in a Kwik3 project to the coordinate x, y of ultimate config(@4x) system of Kwik4

the value of Kwik3 project file (.kwk) is updated for Kwik4. The following project config of Kwik3 can be converted.

* iPad Mini
* New Universal
* iPad Pro
* Universal
* iPad Air

These components have the [x,y] or [width, height] properties and the values are translated to work with Kwik4 system.

* page properties
* layer properties
    * spritesheet
    * video
    * web
    * vector
    * map
    * Multipiler
    * Dynamic Text
    * Count Down
    * Text Replacement
* sync audio & text
* Animation
* Drag
* Swipe
* Scroll
* Canvas
* Joints
* Action
  * canvas brush
  * edit image
* Button

NOTE:Particles are not supported. You may need to edit with particle editor of Kwik4 (Kaboom) to adjust the value of the json file

## KwikGenerate

* KwikGenertate.jsx uses the generator of photoshop to output image files instead of Publish command with export images enabled. 
* This script does not generate lua files. It only outputs images to build4/assets/images/ folder
* Once you have generated images with this scirpt, please go back to Kwik Panel to use Publish command with export images disabled

> this script will be migrated to Kwik sooner or later.
