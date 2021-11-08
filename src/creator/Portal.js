import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Menu, Box } from "grommet";
import { Small, Name } from "./styles";

const Portal = ({ id, vars, initial, update }) => {
  const el = document.getElementById(id);
  const [selected, setSelected] = useState(initial);

  useEffect(() => {}, [vars]);

  if (!el) return null;

  function handleSelected(variable, value, index) {
    setSelected([variable, index]);
    el.setAttribute("data-variable", variable);
    el.setAttribute("data-value", value);
    update(variable.length + 1);
  }

  return createPortal(
    <Box border pad="1px">
      <Menu
        open={!selected}
        dropProps={{
          align: { top: "bottom", left: "left" },
          elevation: "xlarge",
        }}
        items={vars
          .filter((v) => v.variable.length !== 0 && v.value.length !== 0)
          .map((v, i) => ({
            label: v.variable,
            onClick: () => handleSelected(v.variable, `${v.value}`, i),
          }))}
      >
        {selected ? (
          <Box
            contentEditable={false}
            direction="row"
            align="center"
            pad="1px"
            background={vars[selected[1]].isValid ? "#fff" : "#FFBCBC"}
          >
            <Name>{selected[0]}</Name>
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
