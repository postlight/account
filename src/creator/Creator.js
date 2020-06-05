import React, { useState, useRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

let BlockEmbed = Quill.import("blots/block/embed");
class PortalBlot extends BlockEmbed {
  static create() {
    const node = super.create();
    const el = document.getElementById("variable");
    if (el) {
      el.remove();
    }

    node.setAttribute("id", "variable");

    return node;
  }
}
PortalBlot.blotName = "portal";
PortalBlot.tagName = "portal-element";

Quill.register(PortalBlot);

export default function Creator() {
  let quillRef = useRef();
  const [value, setValue] = useState("");

  function getPos() {
    let range = quillRef.current.getEditor().selection.savedRange;
    if (!range || range.length !== 0) return;
    return range.index;
  }

  function addComponent() {
    const position = getPos();

    quillRef.current
      .getEditor()
      .insertEmbed(position, "portal", Quill.sources.USER);
    // quillRef.current.getEditor().setSelection(position + 2, Quill.sources.API);
  }

  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      value={value}
      onChange={setValue}
      onKeyPress={(e) => {
        if (e.key === "@") {
          addComponent("test", "cool");
        }
      }}
    />
  );
}
