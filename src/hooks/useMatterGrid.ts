import { useRef, useEffect, useCallback } from "react";
import Matter from "matter-js";
import { isMobile } from "react-device-detect";

type ImageWrapperRefs = React.MutableRefObject<(HTMLElement | null)[]>;
type MainRef = React.MutableRefObject<HTMLElement | null>;

interface Options {
  imageWrapperRefs: ImageWrapperRefs;
  mainRef: MainRef;
  spacing?: number;
  gutter?: number;
}

export const useMatterGrid = ({
  imageWrapperRefs,
  mainRef,
  spacing = 200,
  gutter = 100,
}: Options) => {
  const requestRef = useRef<number>();
  const engineRef = useRef<Matter.Engine>();

  const animate = useCallback(() => {
    engineRef.current = Matter.Engine.create();
    const engine: Matter.Engine = engineRef.current;

    engine.gravity.y = 0;
    engine.timing.timeScale = 5;

    const images: {
      body: Matter.Body;
      elem: HTMLElement;
      render: () => void;
    }[] = imageWrapperRefs.current.map((el, i) => {
      const width = el?.querySelector("img")?.clientWidth ?? 0;
      const height = el?.querySelector("img")?.clientHeight ?? 0;

      const halfWin = window.innerWidth / 2;
      const center = (halfWin - width) / 2;
      const x = i % 2 === 0 ? center + halfWin - gutter : center + gutter;

      const y = imageWrapperRefs.current
        .slice(0, i)
        .reduce(
          (acc, el) => acc + Number(el?.querySelector("img")?.clientHeight),
          spacing
        );

      return {
        body: Matter.Bodies.rectangle(
          x + height / 2,
          y + width / 2,
          width,
          height,
          {
            // frictionAir: 0.1, // Adjust this value to increase linear damping
            collisionFilter: { category: 0b10 },
          }
        ),
        elem: el as HTMLElement,
        render() {
          const { x, y } = this.body.position;
          this.elem.style.transform = `translate(${x - width / 2}px, ${
            y - height / 2
          }px) rotate(${this.body.angle}rad)`;
          this.elem.style.opacity = "1";
          this.elem.style.transitionDelay = `${(i + 1) * 0.15}s`;
        },
      };
    });

    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      collisionFilter: { category: 0b10 },
    });

    // heights
    const iw = mainRef.current?.clientWidth ?? 0;
    let ih = 0;

    // set height of main element
    if (mainRef.current) {
      ih = images.reduce((acc, el) => acc + el.elem.clientHeight, 200);
      mainRef.current.style.height = `${ih}px`;
    }

    // create a wall around the document.body
    const wallOpt = {
      isStatic: true,
    };

    const walls = [
      Matter.Bodies.rectangle(iw / 2, -10, iw, 20, wallOpt), // top
      Matter.Bodies.rectangle(iw / 2, ih + 10, iw, 20, wallOpt), // bottom
      Matter.Bodies.rectangle(-10, ih / 2, 20, ih, wallOpt), // left
      Matter.Bodies.rectangle(iw + 10, ih / 2, 20, ih, wallOpt), // right
    ];

    Matter.World.add(engine.world, [
      ...walls,
      ...images.map((box) => box.body),
      mouseConstraint,
    ]);

    const rerender = () => {
      images.forEach((image) => image.render());
      Matter.Engine.update(engine);
      requestRef.current = requestAnimationFrame(rerender);
    };

    rerender();
  }, [imageWrapperRefs, mainRef]);

  useEffect(() => {
    if (isMobile) return;

    animate();

    const handleResize = () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (engineRef.current) Matter.Engine.clear(engineRef.current);
      animate();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (engineRef.current) Matter.Engine.clear(engineRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [animate]);

  return {
    engineRef,
    animate,
  };
};
