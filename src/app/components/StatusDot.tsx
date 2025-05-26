import React from "react";

interface StatusDotProps {
  color: "red" | "blue" | "gray";
}

const colorMap = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  gray: "bg-gray-400",
};

export default function StatusDot({ color }: StatusDotProps) {
  return (
    <span className="relative flex h-3 w-3">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colorMap[color]} opacity-75`} />
      <span className={`relative inline-flex rounded-full h-3 w-3 ${colorMap[color]}`} />
    </span>
  );
}
