import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Menu, Box } from "grommet";
import { Small, Name } from "./styles";

const Portal = ({ id, vars }) => {
  const [selected, setSelected] = useState("");
  const el = document.getElementById(id);
  if (!el) return null;

  function handleSelected(variable, value) {
    setSelected(variable);
    el.setAttribute("data-variable", variable);
    el.setAttribute("data-value", value);
  }

  return createPortal(
    <Box border pad="1px">
      <Menu
        open
        dropProps={{
          align: { top: "bottom", left: "left" },
          elevation: "xlarge",
        }}
        items={vars
          .filter((v) => v.variable.length !== 0 && v.value.length !== 0)
          .map((v) => ({
            label: v.variable,
            onClick: () => handleSelected(v.variable, `${v.value}`),
          }))}
      >
        {selected.length > 0 ? (
          <Box contentEditable={false} direction="row" align="center" pad="1px">
            <Name>{selected}</Name>
            <Small>var</Small>
          </Box>
        ) : (
          <Box contentEditable={false} direction="row" align="center" pad="1px">
            @<Name>variables</Name>
          </Box>
        )}
      </Menu>
    </Box>,
    el
  );
};

export default Portal;
