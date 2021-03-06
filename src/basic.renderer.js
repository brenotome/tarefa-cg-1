(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
      (global = global || self, factory(global.BasicRenderer = {}));
}(this, (function (exports) {
  'use strict';


  /* ------------------------------------------------------------ */


  function inside(x, y, shape) {
    return shape.isPointInside(x, y);
  }


  function Screen(width, height, scene) {
    this.width = width;
    this.height = height;
    this.scene = this.preprocess(scene);
    this.createImage();
  }

  Object.assign(Screen.prototype, {

    preprocess: function (scene) {
      // cria objeto shape e define boundingBox

      var preprop_scene = [];

      for (var primitive of scene) {
        const createShape = new CreateShape(primitive);
        const shape = createShape.getInstance();

        preprop_scene.push(shape);
      }

      return preprop_scene;
    },

    createImage: function () {
      this.image = nj.ones([this.height, this.width, 3]).multiply(255);
    },

    rasterize: function () {
      var color;

      // In this loop, the image attribute must be updated after the rasterization procedure.
      for (var primitive of this.scene) {

        // Loop through all pixels
        for (var i = 0; i < this.width; i++) {
          var x = i + 0.5;
          for (var j = 0; j < this.height; j++) {
            var y = j + 0.5;
            // First, we check if the pixel center is inside the primitive 
            if (inside(x, y, primitive)) {
              // only solid colors for now
              color = primitive.color;
              this.set_pixel(i, this.height - (j + 1), color);
            }
          }
        }
      }
    },

    set_pixel: function (i, j, colorarr) {
      // We assume that every shape has solid color

      this.image.set(j, i, 0, colorarr.get(0));
      this.image.set(j, i, 1, colorarr.get(1));
      this.image.set(j, i, 2, colorarr.get(2));
    },

    update: function () {
      // Loading HTML element
      var $image = document.getElementById('raster_image');
      $image.width = this.width; $image.height = this.height;

      // Saving the image
      nj.images.save(this.image, $image);
    }
  }
  );

  exports.Screen = Screen;

})));

