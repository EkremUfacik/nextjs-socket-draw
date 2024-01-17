"use client";

import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect, Text, Circle, Line } from "react-konva";
import { ChromePicker } from "react-color";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000");

type Lines = {
  points: number[];
  color: string;
};

const Konva = () => {
  const [lines, setLines] = useState<Lines[]>([]);
  const [color, setColor] = useState("#000000");
  const isDrawing = useRef(false);
  console.log(lines);

  useEffect(() => {
    socket.on("connected", () => {
      console.log("connected");
    });

    socket.on("drawing", (data: Lines[]) => {
      setLines(data);
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
    });

    return () => {
      socket.off("connected");
      socket.off("drawing");
      socket.off("disconnect");
    };
  }, []);

  const handleClear = () => {
    setLines([]);
    socket.emit("drawing", []);
  };

  const handleMouseDown = (e: any) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { points: [pos.x, pos.y], color }]);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    const linesCopy = [...lines];
    linesCopy.splice(lines.length - 1, 1, lastLine);
    setLines(linesCopy);

    socket.emit("drawing", lines);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <div
      className="flex justify-center gap-4 flex-wrap h-screen items-center"
      onMouseUp={handleMouseUp}
    >
      <div className="text-center space-y-6">
        <ChromePicker color={color} onChange={(e) => setColor(e.hex)} />
        <button className="border-2 px-4 py-2 rounded-lg" onClick={handleClear}>
          Clear
        </button>
      </div>
      <Stage
        className="border-2 border-gray-500"
        width={800}
        height={600}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {/* <Text text="Just start drawing" x={5} y={30} /> */}
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.color}
              strokeWidth={5}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default Konva;
