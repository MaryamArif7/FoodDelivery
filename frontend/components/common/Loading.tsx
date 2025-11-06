import React from "react";

const Loading = ({ width = "5", height = "5" }) => {
  return (
    <div className="flex justify-center">
      <div
        className={`border-4 rounded-full border-gray-100 border-t-primary animate-spin mx-1 w-${width} h-${height}`}
      />
    </div>
  );
};

export default Loading;
