import React, { useRef, useState, useEffect } from "react";
import { Layout } from "@/components";
import { isMobile } from "react-device-detect";

type Direction = "UP" | "RIGHT" | "DOWN" | "LEFT";

interface Point {
  top: number;
  left: number;
  type?: number; // Added type to keep track of whether the segment is a 4 or a 0
}

const directionMap: Record<string, Direction> = {
  ArrowUp: "UP",
  ArrowRight: "RIGHT",
  ArrowDown: "DOWN",
  ArrowLeft: "LEFT",
};

const moveMap: Record<Direction, Point> = {
  UP: { top: -1, left: 0 },
  RIGHT: { top: 0, left: 1 },
  DOWN: { top: 1, left: 0 },
  LEFT: { top: 0, left: -1 },
};

const oppositeDirections: Record<Direction, Direction> = {
  UP: "DOWN",
  RIGHT: "LEFT",
  DOWN: "UP",
  LEFT: "RIGHT",
};

const Error404 = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [gridSize, setGridSize] = useState({ width: 0, height: 0 });
  const [snake, setSnake] = useState<Point[]>([
    { top: 0, left: 0, type: 4 },
    { top: 0, left: 1, type: 0 },
    { top: 0, left: 2, type: 4 },
  ]); // Initialized snake with size of 3 and alternating 4's and 0's
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [food, setFood] = useState<Point>({ top: 5, left: 5 });
  const [foodType, setFoodType] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key in directionMap) {
        const newDirection = directionMap[event.key];
        if (newDirection !== oppositeDirections[direction]) {
          setDirection(newDirection);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [direction]);

  useEffect(() => {
    if (!containerRef.current) return;

    const handleResize = () => {
      const { width, height } =
        containerRef.current?.getBoundingClientRect() ?? {
          width: 0,
          height: 0,
        };

      setGridSize({
        width: Math.floor(width / 16),
        height: Math.floor(height / 16),
      });
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const moveSnake = () => {
      const head = snake[0];
      if (!head) return;

      const newHead: Point = {
        top:
          (head.top + moveMap[direction].top + gridSize.height) %
          gridSize.height,
        left:
          (head.left + moveMap[direction].left + gridSize.width) %
          gridSize.width,
        type: head.type === 4 ? 0 : 4, // Alternate type for new head
      };

      if (newHead.top === food.top && newHead.left === food.left) {
        setFood({
          top: Math.floor(Math.random() * gridSize.height),
          left: Math.floor(Math.random() * gridSize.width),
        });

        // Switch food type between 4 and 0
        setFoodType(foodType === 4 ? 0 : 4);
      } else {
        snake.pop();
      }

      setSnake([newHead, ...snake]);
    };

    const speed = Math.max(100, 500 - snake.length * 10 - gridSize.width * 4);
    const intervalId = setInterval(moveSnake, speed);

    return () => {
      clearInterval(intervalId);
    };
  }, [snake, direction, food, gridSize, foodType]);

  return (
    <Layout
      ref={containerRef}
      headerContinuation="not found"
      className="blend-invert fixed bottom-0 left-0 right-0 top-0 h-screen overflow-hidden"
    >
      {!isMobile &&
        Array.from({ length: gridSize.height }, (_, i) => i).map((i) => (
          <div key={i} className="flex">
            {Array.from({ length: gridSize.width }, (_, j) => j).map((j) => (
              <span key={j} className="line-height-0 inline-block h-4 w-4">
                {snake.find((p) => p.top === i && p.left === j)
                  ? snake.find((p) => p.top === i && p.left === j)?.type // Display the type (4 or 0) for the snake segment
                  : food.top === i && food.left === j
                  ? foodType
                  : null}
              </span>
            ))}
          </div>
        ))}
    </Layout>
  );
};

export default Error404;
