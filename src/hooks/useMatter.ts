import { useState, useEffect } from "react";
import Matter from "matter-js";

export const useMatter = () => {
  const [engine] = useState(Matter.Engine.create({ gravity: { scale: 0 } }));
  const [world] = useState(engine.world);

  useEffect(() => {
    Matter.Engine.run(engine);
    return () => {
      Matter.Engine.clear(engine);
    };
  }, [engine]);

  const addBody = (body: Matter.Body) => {
    Matter.World.add(world, body);
  };

  const addMouseConstraint = () => {
    const mouse = Matter.Mouse.create(document.body);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });
    Matter.World.add(world, mouseConstraint);
    return mouseConstraint;
  };

  return { engine, world, addBody, addMouseConstraint };
};
