import React, { useEffect, useState } from "react";
import clsx from "clsx";

const strPad = (value: number) => {
  return String(value).padStart(2, "0");
};

export const Footer = () => {
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [currentMinute, setCurrentMinute] = useState(new Date().getMinutes());
  const currentYear = new Date().getFullYear();

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
    <footer className="relative">
      <p className="container fixed bottom-7 left-0 text-lg">
        {strPad(currentHour)}
        <span className="animate-blink">:</span>
        {strPad(currentMinute)} OSL, NOR
      </p>

      <p className="container absolute bottom-7 text-right text-base">
        Copyright ©{currentYear} Andreas Nygård, All rights reserved
      </p>
    </footer>
  );
};
