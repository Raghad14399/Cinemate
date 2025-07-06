import React from "react";

function HallImageWithLoader({ src, alt, className = "" }) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  return (
    <div className={"relative w-full h-40 bg-gray-800 overflow-hidden rounded-t-lg"}>
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <span className="loader border-2 border-gray-300 border-t-beige3 rounded-full w-8 h-8 animate-spin"></span>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={"w-full h-40 object-cover rounded-t-lg block " + className + (loading ? " opacity-0" : " opacity-100")}
        style={{ position: "relative", zIndex: 5, display: "block" }}
        onLoad={() => setLoading(false)}
        onError={e => {
          setError(true);
          setLoading(false);
          e.target.onerror = null;
          e.target.src = "/images/halls/hall3.jpg";
        }}
      />
    </div>
  );
}

export default HallImageWithLoader;
