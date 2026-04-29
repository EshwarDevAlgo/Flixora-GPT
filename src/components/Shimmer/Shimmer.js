import React from "react";

const Shimmer = () => {
  return (
    <div className="px-4 md:px-8 pt-24">
      {/* Hero shimmer */}
      <div className="w-full h-[50vh] bg-gray-800/50 rounded-xl animate-pulse mb-10" />

      {/* Row shimmers */}
      {[1, 2, 3].map((row) => (
        <div key={row} className="mb-8">
          <div className="w-40 h-6 bg-gray-800/50 rounded mb-3 animate-pulse" />
          <div className="flex gap-3 overflow-hidden">
            {Array(7)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-36 md:w-44 h-52 md:h-64 bg-gray-800/50 rounded-lg animate-pulse"
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Shimmer;
