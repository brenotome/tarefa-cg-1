class CreateShape {//instancia o poligono de acordo com o nome
  constructor(primitive) {
    this.primitive = primitive
  }
  getInstance() {
    const shapes = {
      "triangle": Triangle,
      "circle": Circle,
    }
    return new shapes[this.primitive.shape](this.primitive);
  }
}


class Triangle {
  constructor(primitive) {
    this.name = primitive.shape;
    this.vertices = primitive.vertices;
    this.color = primitive.color;
    this.boundingBox = new BoundingBox(this.vertices);
  }
  isPointInside(x, y) {
    /**
     * Implementa mesma tecnica da lista de exercicios
     */
    if (!this.boundingBox.isPointInside(x,y))
      return false;

    const point = nj.array([x, y]);
    const combinations = [[0, 1], [1, 2], [2, 0]]; //combinações de vertices v2-v1 v3-v2 v1-v3
    const rotate = nj.array([[0, -1], [1, 0]]); //matriz de rotação
    for (let i = 0; i < 3; i++) {
      let v1 = this.vertices.pick(combinations[i][0]);
      let v2 = this.vertices.pick(combinations[i][1]);
      let vectorDirector = nj.subtract(v2, v1);
      let normal = nj.dot(rotate, vectorDirector);
      let pointVector = nj.subtract(point, v1);
      let out = nj.dot(normal, pointVector);
      if (out.get(0) < 1)//caso o angulo não seja agudo o ponto está fora do trinangulo
        return false;
    }
    return true;
  }
}

class Circle {
  constructor(primitive) {
    this.name = primitive.shape;
    this.center = primitive.center;
    this.radius = primitive.radius;
    this.color = primitive.color;
    this.boundingBox = new BoundingBox(primitive, true);
  }
  isPointInside(x, y) {
    if (!this.boundingBox.isPointInside(x,y))
      return false;
    const centerX = this.center.get(0);
    const centerY = this.center.get(1);
    // fora da equação do circulo
    const out = Math.pow(x-centerX,2) + Math.pow(y-centerY,2) > Math.pow(this.radius,2)
    if(out){
      return false;
    }
    return true;
  }
}



class BoundingBox{
  constructor(primitive, isCircle = false){
    if (!isCircle)
      this.boundingBox = this.getBoundingBox(primitive.vertices);
    this.boundingBox = this.getCircleBoundingBox(primitive);
  }
  getBoundingBox(vertices) {
    const minX = vertices.pick(null, 0).min();
    const minY = vertices.pick(null, 1).min();
    const maxX = vertices.pick(null, 0).max();
    const maxY = vertices.pick(null, 1).max();
    return nj.array([[minX, minY], [maxX, maxY]]);
  }
  getCircleBoundingBox(primitive) {
    const centerX = primitive.center.get(0);
    const centerY = primitive.center.get(1);
    const radius = primitive.radius;

    const minX = centerX - radius;
    const minY = centerY - radius;
    const maxX = centerX + radius;
    const maxY = centerY + radius;
    return nj.array([[minX, minY], [maxX, maxY]]);
  }
  isPointInside(x, y){
    //verifica se ponto está dentro do box
    const insideX = (x >= this.boundingBox.get(0, 0)) && (x <= this.boundingBox.get(1, 0));
    const insideY = (y >= this.boundingBox.get(0, 1)) && (y <= this.boundingBox.get(1, 1));
    return (insideX && insideY);
  }
}