import { useState } from "react";

function LatestImageCard() {
  const [loading, setLoading] = useState(true);
  const imageUrl =
    "https://science.nasa.gov/wp-content/uploads/2023/09/ssc2008-10b1.jpg";

  // Download image
 const handleDownload = async () => {
  try {
    const response = await fetch(imageUrl, { mode: "cors" });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = "latest-image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url); // clean up
  } catch (error) {
    console.error("Download failed:", error);
  }
};


  // Fullscreen image
  const handleFullscreen = () => {
    const img = document.getElementById("latest-image");
    if (img.requestFullscreen) img.requestFullscreen();
    else if (img.webkitRequestFullscreen) img.webkitRequestFullscreen();
    else if (img.msRequestFullscreen) img.msRequestFullscreen();
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto h-[50vh] p-4 rounded-3xl shadow-2xl bg-gradient-to-br from-[#0a1b2d]/90 to-[#1e3a56]/90 border border-[#2b4a78]/40 backdrop-blur-xl overflow-hidden flex flex-col">
      
      {/* Title */}
      <h2 className="text-2xl font-extrabold text-white mb-2 border-b border-[#2b4a78]/50 pb-1 tracking-wide">
        Latest Image
      </h2>

      {/* Image container */}
      <div className="relative flex-1 rounded-2xl overflow-hidden shadow-inner bg-[#1a2f45]/80">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#1a2f45]/60 z-20">
            <div className="loader border-t-4 border-blue-400 border-solid rounded-full w-12 h-12 animate-spin"></div>
          </div>
        )}
        <img
          id="latest-image"
          src={imageUrl}
          alt="Latest telescope capture"
          className="rounded-2xl object-cover w-full h-full z-10 relative"
          onLoad={() => setLoading(false)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/40 opacity-50 z-10"></div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-2">
        <button
          onClick={handleDownload}
          className="flex-1 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg"
        >
          Download
        </button>
        <button
          onClick={handleFullscreen}
          className="flex-1 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg"
        >
          Fullscreen
        </button>
      </div>
    </div>
  );
}

export default LatestImageCard;
