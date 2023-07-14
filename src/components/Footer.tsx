import React, { useEffect, useState } from "react";

const strPad = (value: number) => {
  return String(value).padStart(2, "0");
};

interface Props {
  onTimeDoubleClick?: () => void;
}

export const Footer = ({ onTimeDoubleClick }: Props) => {
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
    <footer className="relative mb-20" onDoubleClick={onTimeDoubleClick}>
      <p className="blend-invert container fixed left-0 top-7 text-base lg:bottom-7 lg:top-auto">
        {strPad(currentHour)}
        <span className="animate-blink">:</span>
        {strPad(currentMinute)} OSL, NOR
      </p>

      <p className="text-balance container bottom-7 text-base lg:fixed lg:text-right">
        Copyright ©{currentYear} Andreas Nygård, All rights reserved
      </p>
    </footer>
  );
};
