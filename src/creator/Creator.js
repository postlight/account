import React, { useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function Creator() {
  const [value, setValue] = useState("");

  return <ReactQuill theme="snow" value={value} onChange={setValue} />;
}
