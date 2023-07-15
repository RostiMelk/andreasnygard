import React, { useRef, useState, useEffect, useCallback } from "react";
import { Layout } from "@/components";
import { isMobile } from "react-device-detect";

type Direction = "UP" | "RIGHT" | "DOWN" | "LEFT";

interface Point {
  top: number;
  left: number;
  type?: number;
}

const initialSnake: Point[] = [
  { top: 10, left: 0, type: 4 },
  { top: 10, left: 1, type: 0 },
  { top: 10, left: 2, type: 4 },
];

const directionMap: Record<string, Direction> = {
  ArrowUp: "UP",
  ArrowRight: "RIGHT",
  ArrowDown: "DOWN",
  ArrowLeft: "LEFT",
  w: "UP",
  d: "RIGHT",
  s: "DOWN",
  a: "LEFT",
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
  const [snake, setSnake] = useState<Point[]>(initialSnake);
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [food, setFood] = useState<Point>({ top: 10, left: 20 });
  const [foodType, setFoodType] = useState(0);

  const handleNewFood = useCallback(() => {
    setFood({
      top: Math.floor(Math.random() * gridSize.height),
      left: Math.floor(Math.random() * gridSize.width),
    });
    setFoodType(foodType === 4 ? 0 : 4);
  }, [gridSize, foodType]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const newDirection = directionMap[event.key];
      if (newDirection && newDirection !== oppositeDirections[direction]) {
        setDirection(newDirection);
      }
    },
    [direction]
  );

  const moveSnake = useCallback(() => {
    const head = snake[0];
    if (!head) return;

    const newHead: Point = {
      top:
        (head.top + moveMap[direction].top + gridSize.height) % gridSize.height,
      left:
        (head.left + moveMap[direction].left + gridSize.width) % gridSize.width,
      type: head.type === 4 ? 0 : 4,
    };

    // Check if the snake has hit itself
    const isOverlapping = snake.some(
      (point) => point.top === newHead.top && point.left === newHead.left
    );
    if (snake.length > initialSnake.length && isOverlapping) {
      setSnake(initialSnake);
      handleNewFood();
      return;
    }

    if (newHead.top === food.top && newHead.left === food.left) {
      handleNewFood();
    } else if (snake.length > initialSnake.length - 1) {
      snake.pop();
    }

    setSnake([newHead, ...snake]);
  }, [snake, direction, gridSize, food, handleNewFood]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [direction, handleKeyDown]);

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

      if (!!gridSize.width) {
        handleNewFood();
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const speed = Math.max(100, 500 - snake.length * 10 - gridSize.width * 10);
    const intervalId = setInterval(moveSnake, speed);
    return () => {
      clearInterval(intervalId);
    };
  }, [snake, direction, food, gridSize, foodType, moveSnake]);

  return (
    <Layout
      title="404 Not Found"
      description="Play a game of snake"
      ref={containerRef}
      headerContinuation="not found"
      className="blend-invert fixed bottom-0 left-0 right-0 top-0 h-screen overflow-hidden"
    >
      {!isMobile &&
        Array.from({ length: gridSize.height }, (_, i) => i).map((i) => (
          <div key={i} className="flex" aria-hidden="true">
            {Array.from({ length: gridSize.width }, (_, j) => j).map((j) => (
              <span key={j} className="line-height-0 inline-block h-4 w-4">
                {snake.find((p) => p.top === i && p.left === j)?.type ??
                  (food.top === i && food.left === j ? foodType : null)}
              </span>
            ))}
          </div>
        ))}
    </Layout>
  );
};

export default Error404;
