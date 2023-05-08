import React, { useEffect, useState } from "react";
import clsx from "clsx";

const strPad = (value: number) => {
  return String(value).padStart(2, "0");
};

export const Footer = () => {
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [currentMinute, setCurrentMinute] = useState(new Date().getMinutes());

  useEffect(() => {
    const intervalId = setInterval(() => {
      const dateStr = new Date().toLocaleString("en-US", {
        timeZone: "Europe/Oslo",
      });
      const date = new Date(dateStr);
      setCurrentHour(date.getHours());
      setCurrentMinute(date.getMinutes());
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <footer
      className={clsx("blend-invert container fixed bottom-0 left-0 pb-7")}
    >
      <span className="text-lg">
        {strPad(currentHour)}
        <span className="animate-blink">:</span>
        {strPad(currentMinute)} OSL, NOR
      </span>
    </footer>
  );
};
