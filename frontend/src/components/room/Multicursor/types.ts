type Point = {
  x: number;
  y: number;
};

type Stroke = {
  userId: string;
  color: string;
  strokeWidth:number;
  opacity:number;
  points: Point[];
};

type ActiveStroke = {
  color: string;
  strokeWidth:number;
  opacity:number;
  points: Point[];
};

type BoardImage = {
  id: string;
  image: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number | 0;
};

interface TextBox {
  id: string;
  type: "textbox";
  x: number;
  y: number;
  text: string;
  fontSize: number;
  color: string;
  userId: string;
  textAlign:string;
  rotation?:number
}

interface Shape {
  id: string;
  type: "shape";
  shapeType: "square" | "circle" | "diamond";
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  rotation:number;
  fillColor:string;
  edgeStyle:string;
  strokeWidth:number;
  strokeStyle:string;
  userId: string;
}
interface Line {
  id: string;
  type: "line";
  lineType: "straight" | "arrow";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  cpx?: number;
  cpy?: number;
  color: string;
  strokeWidth: number;
  lineStyle:string;
  arrowType:string;
  arrowHead:string;
  userId: string;
}

type CanvasElement = TextBox | Shape | Line;

export type {
  Point,
  Stroke,
  ActiveStroke,
  BoardImage,
  TextBox,
  Shape,
  Line,
  CanvasElement,
};
