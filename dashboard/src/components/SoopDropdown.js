import React, { useState } from "react";
import styled from "styled-components";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { sendMessage } from "../utils/socket";

const DropdownContainer = styled.div`
  width: 200px;
`;

const SoopDropdown = ({ node }) => {
  const [option, setOption] = useState("");

  const exampleData = {
    label: "dropdown",
    tooltip: "dropdown node",
    placeholder: "Select option",
    option: node.options,
  };
  const entries = Object.entries(exampleData.option);
  console.log(node.options);

  const onChange = e => {
    // FIXME: 현재 value로만 변경값이 저장되는데.. key는 어떻게 해야할지 허허
    // 일단 node.option에 value, label, type도 같이 보내게 했습니다. 나중에 꺼내쓸 수 있습니다.
    setOption(e.target.value);
    sendMessage(node.id, { value: e.target.value });
  };
  return (
    <>
      <DropdownContainer>
        <FormControl fullWidth>
          <InputLabel id="soop-dashboard-select-label">{exampleData.label}</InputLabel>
          <Select
            labelId="soop-dashboard-select-label"
            label={exampleData.placeholder}
            value={option}
            onChange={onChange}
          >
            {entries.map((entry, idx) => {
              return (
                <MenuItem key={idx} value={entry[1].label}>
                  {entry[1].label}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </DropdownContainer>
    </>
  );
};

export default SoopDropdown;
