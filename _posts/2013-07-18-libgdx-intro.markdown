---
layout: post
title:  "First steps with LibGDX"
date:   2013-07-18
tags: android demo game
---
# Introduction

LibGDX is an android game engine. I choose this one because:

- It is well documented and offers plenty of features
- Code is written in Java
- It offers output apps on several platforms, including desktop Java which is very convenient for debugging
- There is a plain Java iOS version almost at hand (not to mention the already functional Mono version)

It is to be found [here](http://libgdx.badlogicgames.com/).

This demo is my first contact with it, in the form of a simple Goban. A Goban is a board to play Go. Each player places a stone of their color (white or black). The actual rules of Go are slightly (but not much) more complicated than that.

In this demo, I will show how to design a tiled map, display it, move around it, and place items (stones) on the board. This is a basic mechanism that can be reused for many board games. (Which I plan to).

You'll find that some steps are detailed extensively. That is because I find the provided tutorials much better suited than what I would do here (Tiled), or the interface intuitive enough (gdx-setup-ui).

Code for this demo is here <https://github.com/smaspe/GDXGoban>

# Design the board

LibGDX reads (among others) .tmx files. Those files are tiled maps description files, and can be edited using <http://www.mapeditor.org/>. Download the latest version, follow the tutorial, you have a level map.

Two specific things about LibGDX:

- You need 8-bit png files as your tileset. You can convert your images with ImageMagick (where mymap.ext is your image file, ImageMagick understands most formats):

```
convert mymap.ext png8:mymap.png
```

- Your tmx and tileset must be saved at the same place, since tmx format contains relative reference to the tileset image.

# Initialize the application

Download the nightly, run `gdx-setup-ui.jar`, follow the instruction, and you have your skeleton created. Base project, desktop and android project at least should be imported into Eclipse. I find the web application more optional.

# Display the board

Tiled maps from Tiled are opened with `TmxMapLoader`. An Orthogonal renderer is provided. It renders a fixed size view port on a plan that ignores z-values. It renders on an `OrthographicCamera`. In this example, `unitScale` is `1/32f`, 32 pixels being the size of a tile of the map. It allows to make all computation based on this reference system, which is much simpler. `WIDTH` and `HEIGHT` are `19`, as a Goban usually is.

As you can see, the in game reference system is immediatly used by the camera, as shown by `camera.position.x = WIDTH / 2;` which places the camera at the center of the board.

{% gist smaspe/6030401 %}

Rendering the map is done in the `render()` method, which is called by GDX to have you render your screen

{% gist smaspe/6030538 %}

# Move Around

Adding input processors is quite simple.

{% gist smaspe/6030458 %}

The 2 first processors are used to move around the map using the mouse and the keyboard. They are very self-explanatory.

# Put down some stones

The 3rd processor is used to put stones on the board. `GestureDetector` acts as an `InputProcessor` and passes the detected gestures to the `GestureListener`. In this case, the tap gesture is sufficient.

{% gist smaspe/6030505 %}

The coordinates given are on screen. camera.unproject make the complete transformation so that the new coordinates are in the camera system and represent actual tiles of the board. The coordinates are passed back to the game, which simply places a value in a representation of the status of the board.

{% gist smaspe/6030526 %}

Rendering the stone is not very complex either, again the in-game coordinates system makes the code simple and readable. You simply draw a texture at a position in a SpriteBatch that uses the Camera projection.

{% gist smaspe/6030547 %}

# Conclusion

I am fairly convinced by LibGDX. While writing this article I have started another project (somewhat a little more ambitious), and so far I have found no big issue with what I tried to do. I have started to use scene2d for UI widgets, combined with maps, sprites and cameras.

I haven't really found any big con in LibGDX.
