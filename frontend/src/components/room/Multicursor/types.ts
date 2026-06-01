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
  id: string; // add this
  image: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type { Point, Stroke, ActiveStroke, BoardImage };