class CreateShape {//instancia o poligono de acordo com o nome
  constructor(primitive) {
    this.primitive = primitive
  }
  getInstance() {
    const shapes = {
      "triangle": Triangle,
      "circle": Circle,
      "polygon": Polygon
    }
    return new shapes[this.primitive.shape](this.primitive);
  }
}


class Triangle {
  constructor(primitive) {
    this.name = primitive.shape;
    this.vertices = primitive.vertices;
    this.color = primitive.color;
    this.boundingBox = new BoundingBox(primitive);
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


class Polygon{
  constructor(primitive){
    this.name = primitive.shape;
    this.vertices = primitive.vertices;
    this.color = primitive.color;
    this.boundingBox = new BoundingBox(primitive);
    this.triangles = this.fanTriangulation();
  }
  isPointInside(x,y){
    if (!this.boundingBox.isPointInside(x,y))
      return false;
    for (const triangle of this.triangles) {
      if (triangle.isPointInside(x,y))
        return true;
    }
    return false;
  }
  fanTriangulation(){
    let triangles = []
    const polygon = this.vertices.tolist()
    const commonPoint = polygon[0]
    for (let i = 1; i<polygon.length-1; i++){
      triangles.push(new Triangle({
        shape:"triangle",
        vertices: nj.array([commonPoint,polygon[i],polygon[i+1]]),
        color:this.color
      }))
    }
    return triangles
  }
}


class Circle {
  constructor(primitive) {
    this.name = primitive.shape;
    this.center = primitive.center;
    this.radius = primitive.radius;
    this.color = primitive.color;
    this.boundingBox = new BoundingBox(primitive, true);
    this.triangles = this.triangulation();

  }

  isPointInsideByEquation(x, y) {
    // calcula pela equação do circulo
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

  isPointInside(x, y) {
    // calcula por triangulação
    if (!this.boundingBox.isPointInside(x,y))
      return false;
    for (const triangle of this.triangles) {
      if (triangle.isPointInside(x,y))
        return true;
    }
    return false;
  }

  triangulation(){
    let triangles = []
    const r = this.radius
    const center = this.center.tolist();
    let lastPoint = [center[0]+r,center[1]]; // o primeiro ponto é (X+raio,0)
    for (let i = 0.1; i <= 2.1; i= i+0.1){
      //pega pontos na borda do circulo
      let currentPoint = [r*Math.cos(Math.PI*i)+center[0],r*Math.sin(Math.PI*i)+center[1]];
      triangles.push(new Triangle({
        shape:"triangle",
        vertices: nj.array([center,lastPoint,currentPoint]),
        color:this.color
      }))
      lastPoint=currentPoint;
    }
  return triangles;
  }
  
}


class BoundingBox{
  constructor(primitive, isCircle = false){
    if (isCircle)
      this.boundingBox = this.getCircleBoundingBox(primitive);
    else
      this.boundingBox = this.getBoundingBox(primitive.vertices);
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