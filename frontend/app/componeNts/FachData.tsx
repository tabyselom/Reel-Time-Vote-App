// import { useState } from "react";
import React from "react";

async function FachData() {
  const res = await fetch(
    "http://localhost:5000/api/poll/get/1a7d6c26-5c4c-451e-94c9-a301a17e093d"
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();
  console.log(data.options);
  return (
    <div>
      <h1>FachData</h1>
      <p>Question: {data.question}</p>
      <p>Options:</p>
      <ul>
        {data.options.map((option: { text: string }, index: number) => (
          <li key={index}>{option.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default FachData;
