import type { GetStaticProps } from "next";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { isMobile } from "react-device-detect";

import clsx from "@/lib/clsx";
import type { NotFoundProps } from "./types";
import { client, groq } from "@/lib/sanity.client";
import { Layout, Wysiwyg } from "@/components";

type Direction = "UP" | "RIGHT" | "DOWN" | "LEFT";

interface Point {
  top: number;
  left: number;
  type?: number;
}

const initialSnake: Point[] = [
  { top: 10, left: 1, type: 4 },
  { top: 10, left: 1, type: 0 },
  { top: 10, left: 1, type: 4 },
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

const topGutter = 4;
const wallLockThreshold = 16;

const NotFound = ({ notFoundPage }: NotFoundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gridSize, setGridSize] = useState({ width: 0, height: 0 });
  const [snake, setSnake] = useState<Point[]>(initialSnake);
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [food, setFood] = useState<Point>({ top: 10, left: 20 });
  const [foodType, setFoodType] = useState(0);
  const [justDied, setJustDied] = useState(false);
  const [wallLock, setWallLock] = useState(false);

  const handleNewFood = useCallback(() => {
    setFood({
      top:
        Math.floor(Math.random() * (gridSize.height - topGutter)) + topGutter,
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

  const handleReset = useCallback(() => {
    setSnake(initialSnake);
    setDirection("RIGHT");
    setJustDied(true);
    setWallLock(false);
    handleNewFood();
  }, []);

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

    if (newHead.top === food.top && newHead.left === food.left) {
      handleNewFood();
    } else if (!justDied) {
      snake.pop();
    }

    const isOverlapping = snake.some(
      (point) => point.top === newHead.top && point.left === newHead.left
    );

    const isCrashingIntoWall =
      (direction === "UP" && newHead.top === gridSize.height - 1) ||
      (direction === "RIGHT" && newHead.left === 0) ||
      (direction === "DOWN" && newHead.top === 0) ||
      (direction === "LEFT" && newHead.left === gridSize.width - 1);

    // if crash into self
    if (snake.length > initialSnake.length && isOverlapping) {
      handleReset();
      return;
    }

    // if crash into wall and wall lock is on
    if (isCrashingIntoWall && wallLock) {
      handleReset();
      return;
    }

    // if crash into wall
    if (
      newHead.top <= 0 ||
      newHead.top >= gridSize.height ||
      newHead.left <= 0 ||
      newHead.left >= gridSize.width
    ) {
    }

    setJustDied(false);
    setSnake([newHead, ...snake]);
  }, [snake, direction, gridSize, food, handleNewFood, justDied]);

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
  }, [wallLock]);

  useEffect(() => {
    const speed = Math.max(2, 500 - snake.length * 5 - gridSize.width * 3.2);

    // If snake is more than 15 long, lock the walls
    if (snake.length >= wallLockThreshold) {
      setWallLock(true);
    }

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
      headerContinuation={notFoundPage?.headerContinuation.map((block) => (
        <Wysiwyg key={block._key} value={block} />
      ))}
      continuationClassName="grid [&>p]:indent-0 mt-8"
      className={clsx(
        "blend-invert pointer-events-none fixed bottom-0 left-0 right-0 top-0 m-0 h-screen overflow-hidden p-0 transition-colors duration-500",
        "before:fixed before:bottom-0 before:left-0 before:right-0 before:top-0 before:border-0 before:transition-all before:duration-500",
        {
          "bg-black": justDied,
          "before:m-1 before:border before:border-dashed": wallLock,
        }
      )}
      hideFooter
      hideTitle
    >
      {!isMobile &&
        Array.from({ length: gridSize.height }, (_, i) => i).map((i) => (
          <div key={i} className="flex" aria-hidden="true">
            {Array.from({ length: gridSize.width }, (_, j) => j).map((j) => (
              <span key={j} className="inline-block h-4 w-4 text-base">
                {snake.find((p) => p.top === i && p.left === j)?.type ??
                  (food.top === i && food.left === j ? foodType : null)}
              </span>
            ))}
          </div>
        ))}
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const notFoundPage: NotFoundProps["notFoundPage"] = await client.fetch(groq`
    *[_type == "notFoundPage"][0] {
      headerContinuation,
    }
  `);

  return {
    props: {
      notFoundPage,
    },
  };
};

export default NotFound;
