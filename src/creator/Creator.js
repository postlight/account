import React, { useState, useRef, useEffect, useCallback } from "react";
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
let Delta = Quill.import("delta");

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
  const [title, setTitle] = useState("Sodas");
  const [value, setValue] = useState("");
  const [variables, setVariables] = useState([
    { variable: "sodas", value: "1-4", isValid: true },
    { variable: "sodas_cost", value: "1.50", isValid: true },
    {
      variable: "month_spend",
      value: "=sodas * sodas_cost * 30",
      isValid: true,
    },
  ]);
  const [portals, setPortals] = useState([]);
  const [showLayer, setShowLayer] = useState(false);
  const [preview, setPreview] = useState();

  function updateVar(index, key, value) {
    const update = [...variables];

    update[index][key] = value;

    if (key === "value" && value.trim().charAt(0) === "=") {
      update[index].isValid = validate(value, update[index].variable);
    }
    setVariables(update);
  }

  function validate(val, test) {
    const varsOnly = variables.reduce(
      (acc, cur) => (cur.variable !== test ? [...acc, cur.variable] : acc),
      []
    );
    const testVars = val
      .replace(/[^\w\s]/gi, "")
      .replace(/[0-9]/g, "")
      .split(" ")
      .reduce((acc, cur) => (cur.length > 0 ? [...acc, cur] : acc), []);
    const intersection = varsOnly.filter((x) => testVars.includes(x));
    return intersection.length === testVars.length;
  }
  const loadSavedStory = useCallback((story) => {
    const stories = JSON.parse(localStorage.getItem("savedStories"));
    console.log(stories[story].value);

    setVariables(stories[story].variables);
    setTitle(stories[story].title);
    setValue(new Delta(stories[story].value));
    setPortals(stories[story].portals);
  }, []);

  useEffect(() => {
    console.log(localStorage.getItem("savedStories"));
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

  useEffect(() => {}, [variables, loadSavedStory]);

  return (
    <CreatorWrapper>
      <Title>
        <Heading>Title</Heading>
        <TextInput
          size="small"
          value={title || ""}
          onChange={(e) => setTitle(e.target.value)}
        />
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
                setPreview(
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
            <Publish
              disabled={!title}
              border={false}
              label="save"
              onClick={() => {
                const savedStories =
                  JSON.parse(localStorage.getItem("savedStories")) || [];
                const newStory = {
                  title,
                  variables,
                  portals,
                  value: quillRef.current.getEditor().getContents(),
                };
                localStorage.setItem(
                  "savedStories",
                  JSON.stringify([...savedStories, newStory])
                );
              }}
            />
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
                  isValid={v.isValid}
                  contentEditable
                  suppressContentEditableWarning
                  as="textarea"
                  defaultValue={v.variable}
                  onBlur={(e) => updateVar(i, "variable", e.target.value)}
                />
                <VarTableCell
                  contentEditable
                  suppressContentEditableWarning
                  as="textarea"
                  defaultValue={v.value}
                  onBlur={(e) => updateVar(i, "value", e.target.value)}
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
                setVariables((prev) => [
                  ...prev,
                  { variable: "", value: "", isValid: true },
                ])
              }
            />
          </Box>
        </VarTable>
        <VarTable margin={{ top: "medium" }}>
          <Box direction="row">
            <VarTableHeader>Saved Stories</VarTableHeader>
          </Box>
          {localStorage.getItem("savedStories") &&
            JSON.parse(localStorage.getItem("savedStories")).map((s, i) => (
              <Box direction="row" key={i}>
                <VarTableCell>
                  <Text>{s.title}</Text>
                </VarTableCell>
                <VarTableCell>
                  <Button
                    plain
                    label="open"
                    onClick={() => loadSavedStory(i)}
                  />
                </VarTableCell>
              </Box>
            ))}
        </VarTable>
        {variables
          .filter((v) => !v.isValid)
          .map((v) => (
            <Box key={v.variable} direction="row" width="290px">
              <Text color="red" size="small" weight="bold">
                {v.variable} contains undefined variables.
              </Text>
            </Box>
          ))}
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
                ast={parse(preview)[0]}
                astState={parse(preview)[1]}
                markdown={preview}
                page={"creator"}
              />
            </Box>
          </Box>
        </Layer>
      )}
    </CreatorWrapper>
  );
}
