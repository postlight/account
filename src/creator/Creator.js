import React, { useState, useRef, useEffect } from "react";
import { Box, TextInput, Text, Button, Layer } from "grommet";
import ReactQuill, { Quill } from "react-quill";
import Portal from "./Portal";
import Section from "../Section";
import parse from "../smarter-text";
import {
  CreatorWrapper,
  Title,
  Heading,
  Body,
  Editor,
  Preview,
  Publish,
  VarTable,
  VarTableBox,
  VarTableCell,
  VarTableHeader,
} from "./styles";

import "./Creator.css";
import "react-quill/dist/quill.snow.css";

let BlockEmbed = Quill.import("blots/block/embed");

class PortalBlot extends BlockEmbed {
  static create(data) {
    console.log(data);
    const node = super.create();
    const el = document.getElementById(data.id);
    if (el) {
      el.remove();
    }

    node.setAttribute("id", data.id);
    node.setAttribute("data-variable", "");
    node.setAttribute("data-value", "");

    return node;
  }

  static formats(node) {
    return {
      "data-variable": node.getAttribute("data-variable"),
      "data-value": node.getAttribute("data-value"),
    };
  }
}
PortalBlot.blotName = "portal";
PortalBlot.tagName = "portal-element";

Quill.register(PortalBlot);

export default function Creator() {
  let quillRef = useRef();
  const [value, setValue] = useState("");
  const [variables, setVariables] = useState([
    { variable: "sodas_daily", value: "1-4" },
    { variable: "sodas_cost", value: "1.50" },
    { variable: "month_spend", value: "=sodas_daily * sodas_cost * 30" },
  ]);
  const [portals, setPortals] = useState([]);
  const [showLayer, setShowLayer] = useState(false);
  const [contents, setContents] = useState();

  useEffect(() => {
    quillRef.current.editor.keyboard.addBinding(
      {
        key: "2",
        shiftKey: true,
      },
      function (range, context) {
        const id = new Date().getTime();

        this.quill.insertEmbed(range.index, "portal", { id });
        this.quill.insertText(range.index + 1, " ");
        this.quill.setSelection(range.index + 2);
        setPortals((prev) => [...prev, { id }]);
      }
    );
  }, []);

  return (
    <CreatorWrapper>
      <Title>
        <Heading>Title</Heading>
        <TextInput size="small" />
      </Title>
      <Body>
        <Heading>Body</Heading>
        <Editor>
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={value}
            onChange={setValue}
            modules={{
              toolbar: [["bold", "italic", "underline"], ["link"]],
            }}
          />
          <Box direction="row" pad="small" alignSelf="end">
            <Preview
              plain
              label="preview"
              onClick={() => {
                setContents(
                  quillRef.current
                    .getEditor()
                    .getContents()
                    .ops.reduce(
                      (acc, cur) =>
                        `${acc}${
                          typeof cur.insert === "string"
                            ? cur.insert.replace("↵", "")
                            : `{${cur.attributes["data-value"]}:${cur.attributes["data-variable"]}}`
                        }`,
                      ""
                    )
                );
                setShowLayer(true);
              }}
            />
            <Publish border={false} label="publish" />
          </Box>
        </Editor>
      </Body>
      <VarTableBox>
        <Heading>Variable Table</Heading>

        <VarTable>
          <Box direction="row">
            <VarTableHeader>Variable</VarTableHeader>
            <VarTableHeader>Value</VarTableHeader>
          </Box>
          <Box>
            {variables.map((v, i) => (
              <Box direction="row" key={v.variable}>
                <VarTableCell
                  header
                  contentEditable
                  suppressContentEditableWarning
                  as="textarea"
                  defaultValue={v.variable}
                  onBlur={(e) => console.log(e.target.value)}
                />
                <VarTableCell
                  contentEditable
                  suppressContentEditableWarning
                  as="textarea"
                  defaultValue={v.value}
                  onBlur={(e) => console.log(e.target.value)}
                />
              </Box>
            ))}

            <Button
              plain
              label={
                <Text color="blue" size="small">
                  + add a variable
                </Text>
              }
              onClick={() =>
                setVariables((prev) => [...prev, { variable: "", value: "" }])
              }
            />
          </Box>
        </VarTable>
      </VarTableBox>
      {portals.length > 0 &&
        portals.map((p) => <Portal key={p.id} id={p.id} vars={variables} />)}
      {showLayer && (
        <Layer full animation="fadeIn">
          <Box fill background="light-4" align="end" pad="large">
            <Button
              plain
              label={<h1>X</h1>}
              onClick={() => setShowLayer(false)}
              margin="medium"
            />
            <Box fill background="#fff" pad="small">
              <Section
                ast={parse(contents)[0]}
                astState={parse(contents)[1]}
                markdown={contents}
                page={"creator"}
              />
            </Box>
          </Box>
        </Layer>
      )}
    </CreatorWrapper>
  );
}
