(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.BasicRenderer = {}));
}(this, (function (exports) { 'use strict';


        /* ------------------------------------------------------------ */


        
    function inside(  x, y, primitive  ) {
            const shapes = {
                "triangle" : insideTriangle
            }            
            return shapes[primitive.shape](x, y, primitive.vertices)
    }

    function insideTriangle(x, y, vertices) {
        /**
         * Implementa mesma tecnica da lista de exercicios
         */
        const point = nj.array([x,y])
        const combinations = [[0,1],[1,2],[2,0]] //combinações de vertices v2-v1 v3-v2 v1-v3
        const rotate = nj.array([[0,-1],[1,0]]) //matriz de rotação
        for (let i = 0; i < 3; i++) {
            let v1 = vertices.pick(combinations[i][0])
            let v2 = vertices.pick(combinations[i][1])
            let vectorDirector = nj.subtract(v2,v1)
            let normal = nj.dot(rotate,vectorDirector)
            let pointVector = nj.subtract(point, v1)
            let out = nj.dot(normal, pointVector)
            if (out.get(0) < 1)//caso o angulo não seja agudo o ponto está fora do trinangulo
                return false
        }
        return true
    }
        
    
    function Screen( width, height, scene ) {
        this.width = width;
        this.height = height;
        this.scene = this.preprocess(scene);   
        this.createImage(); 
    }

    Object.assign( Screen.prototype, {

            preprocess: function(scene) {
                // Possible preprocessing with scene primitives, for now we don't change anything
                // You may define bounding boxes, convert shapes, etc
                
                var preprop_scene = [];

                for( var primitive of scene ) {  
                    // do some processing
                    // for now, only copies each primitive to a new list

                    preprop_scene.push( primitive );
                    
                }

                
                return preprop_scene;
            },

            createImage: function() {
                this.image = nj.ones([this.height, this.width, 3]).multiply(255);
            },

            rasterize: function() {
                var color;
         
                // In this loop, the image attribute must be updated after the rasterization procedure.
                for( var primitive of this.scene ) {

                    // Loop through all pixels
                    for (var i = 0; i < this.width; i++) {
                        var x = i + 0.5;
                        for( var j = 0; j < this.height; j++) {
                            var y = j + 0.5;

                            // First, we check if the pixel center is inside the primitive 
                            if ( inside( x, y, primitive ) ) {
                                // only solid colors for now
                                color = primitive.color;
                                this.set_pixel( i, this.height - (j + 1), color );
                            }
                            
                        }
                    }
                }
                
               
              
            },

            set_pixel: function( i, j, colorarr ) {
                // We assume that every shape has solid color
         
                this.image.set(j, i, 0,    colorarr.get(0));
                this.image.set(j, i, 1,    colorarr.get(1));
                this.image.set(j, i, 2,    colorarr.get(2));
            },

            update: function () {
                // Loading HTML element
                var $image = document.getElementById('raster_image');
                $image.width = this.width; $image.height = this.height;

                // Saving the image
                nj.images.save( this.image, $image );
            }
        }
    );

    exports.Screen = Screen;
    
})));

