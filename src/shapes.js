class CreateShape{//instancia o poligono de acordo com o nome
    constructor(name, vertices){
        this.name = name
        this.vertices = vertices
    }
    getInstance(){
        const shapes = {
            "triangle" : Triangle
        }
        return new shapes[this.name](this.name, this.vertices)
    }
}

class Triangle{
    constructor(name, vertices){
        this.name = name;
        this.vertices = vertices;
        this.boundingBox = this.getBoundingBox();
    }
    isPointInside(x,y){
        /**
         * Implementa mesma tecnica da lista de exercicios
         */
        const point = nj.array([x,y])
        const combinations = [[0,1],[1,2],[2,0]] //combinações de vertices v2-v1 v3-v2 v1-v3
        const rotate = nj.array([[0,-1],[1,0]]) //matriz de rotação
        for (let i = 0; i < 3; i++) {
            let v1 = this.vertices.pick(combinations[i][0])
            let v2 = this.vertices.pick(combinations[i][1])
            let vectorDirector = nj.subtract(v2,v1)
            let normal = nj.dot(rotate,vectorDirector)
            let pointVector = nj.subtract(point, v1)
            let out = nj.dot(normal, pointVector)
            if (out.get(0) < 1)//caso o angulo não seja agudo o ponto está fora do trinangulo
                return false
        }
        return true
    }
    isPointInsideBoundingBox(x,y){
        //verifica se ponto está dentro do box
        const insideX = (x >= this.boundingBox.get(0,0)) && (x <= this.boundingBox.get(1,0)) 
        const insideY = (y >= this.boundingBox.get(0,1)) && (y <= this.boundingBox.get(1,1))
        return (insideX && insideY)
    }
    getBoundingBox(){
        const minX = this.vertices.pick(null,0).min()
        const minY = this.vertices.pick(null,1).min()
        const maxX = this.vertices.pick(null,0).max()
        const maxY = this.vertices.pick(null,1).max()
        return nj.array([[minX,minY],[maxX,maxY]])
    }

}
