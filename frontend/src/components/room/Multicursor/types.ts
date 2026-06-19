type Point = {
  x: number;
  y: number;
};

type Stroke = {
  userId: string;
  color: string;
  points: Point[];
};

type ActiveStroke = {
  color: string;
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
  filled: boolean;
  userId: string;
}

type CanvasElement = TextBox | Shape;

export type {
  Point,
  Stroke,
  ActiveStroke,
  BoardImage,
  TextBox,
  Shape,
  CanvasElement,
};
