"use client";

function ChBt() {
  return (
    <>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => (window.location.href = "/create")}
      >
        {" "}
        Create Poll
      </button>
    </>
  );
}

export default ChBt;
