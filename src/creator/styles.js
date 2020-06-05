import styled from "styled-components";
import { Box, Text, Button } from "grommet";

export const Small = styled(Text)`
  color: #868686;
  font-family: "Helvetica Neue";
  font-size: 8px;
  letter-spacing: 0.2px;
  text-transform: uppercase;
`;

export const Name = styled(Text)`
  color: #434343;
  font-family: "Helvetica Neue";
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0.3px;
  margin-right: 4px;
  text-transform: lowercase;
`;

export const Heading = styled(Text)`
  color: #3d3d3d;
  font-family: "Helvetica Neue";
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0.32px;
  line-height: 17px;
  padding: 6px 0;
  text-align: left;
`;

export const CreatorWrapper = styled(Box)`
  display: grid;
  grid-template-columns: 3fr auto;
  grid-template-rows: 100px 600px;
  grid-column-gap: 30px;
  grid-row-gap: 11px;
  padding: 0 250px;
`;

export const Title = styled(Text)`
  grid-area: 1 / 1 / 2 / 2;
`;

export const Body = styled(Box)`
  grid-area: 2 / 1 / 3 / 2;
`;

export const Editor = styled(Box)`
  background-color: #ffffff;
  border-radius: 4px;
  border: 1px solid #cacaca;
  box-sizing: border-box;
`;

export const Preview = styled(Button)`
  color: #455cff;
  font-family: "Helvetica Neue";
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0.32px;
  line-height: 17px;
  margin-right: 15px;
  text-transform: uppercase;
`;
export const Publish = styled(Button)`
  background-color: #455cff;
  border: none;
  border-radius: 4px;
  color: #ffffff;
  font-family: "Helvetica Neue";
  font-size: 14px;
  font-weight: bold;
  height: 34px;
  letter-spacing: 0.32px;
  line-height: 17px;
  text-transform: uppercase;
  width: 109px;
`;

export const VarTableBox = styled(Box)`
  grid-area: 1 / 2 / 3 / 2;
`;

export const VarTable = styled(Box)`
  box-sizing: border-box;
  width: 290px;
  border: 1px solid #cacaca;
  border-radius: 4px;
  background-color: #ffffff;
`;
export const VarTableCell = styled(Box)`
  background-color: ${({ header, isValid }) =>
    header ? (isValid ? "#dcffeb" : "#FFBCBC") : "#fff"};
  border: 1px solid #cacaca;
  box-sizing: border-box;
  color: #595959;
  font-family: "Helvetica Neue";
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.32px;
  line-height: 17px;
  min-height: 28px;
  padding: 6px;
  resize: none;
  width: 50%;
`;

export const VarTableHeader = styled(VarTableCell)`
  border: none;
  color: #595959;
  font-family: "Helvetica Neue";
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.27px;
  line-height: 15px;
  padding: 12px 6px;
  resize: none;
  text-transform: capitalize;
`;
export const Option = styled(Box)`
  background-color: #c8c9ca;
  border-radius: 0 0 2px 2px;
  border: 1px solid #aeb7c0;
  box-sizing: border-box;
  color: #434343;
  font-family: "Helvetica Neue";
  font-size: 12px;
  font-weight: 500;
  height: 27px;
  letter-spacing: 0.3px;
  line-height: 15px;
  opacity: 0.55;
`;
