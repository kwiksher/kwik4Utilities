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

You need to enlarge Image size or Canvas Size of each psd files manually. See the following articles from Getting Startted > Guidelines

* [Kwik3 image on a PSD of Kwik4](https://kwiksher.com/doc/getting_startted/guidelines/migration_from_kwik3/content_area_nw2uc/)

* [A background layer](https://kwiksher.com/doc/getting_startted/guidelines/screenshot/)

## KwikGenerate

* KwikGenertate.jsx uses the generator of photoshop to output image files instead of Publish command with export images enabled. 
* This script does not generate lua files. It only outputs images to build4/assets/images/ folder
* Once you have generated images with this scirpt, please go back to Kwik Panel to use Publish command with export images disabled
* Ultimate config project only

For Mac,it will create a file - **temp.command** in ~/Documents/Kwik folder and it needs a file permmission for execute. 

1. Create a test project 
1. run the script
1. find ~/Documents/Kwik/temp.command 
1. add file permission to execute
1. run the script again. this time will succeed
1. check images are outputted in build4/assets/images

Once temp.command has a permission to execute, it keeps the permission whenever temp.command is updated for another project

> this script will be migrated to Kwik sooner or later.
