type Stroke = {
  userId: string;
  color: string;
  opacity: number;
  strokeWidth:number;
  points: { x: number; y: number }[];
};

type ImageElement = {
  id: string;
  image: string;
  userId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number | 0;
};

type CanvasElement =
  | {
      id: string;
      type: "textbox";
      x: number;
      y: number;
      text: string;
      fontSize: number;
      color: string;
      userId: string;
      rotation?: number;
    }
  | {
      id: string;
      type: "shape";
      shapeType: "square" | "circle" | "diamond";
      x: number;
      y: number;
      width: number;
      height: number;
      color: string;
      userId: string;
      fillColor:string;
    }
  | {
      id: string;
      type: "line";
      lineType: "arrow" | "straight";
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      cpx?: number;
      cpy?: number;
      color: string;
      userId: string;
    };

export type { Stroke, ImageElement, CanvasElement };
