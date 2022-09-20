import React from "react";
import styled from "styled-components";
import {
  mainColor,
  gradientColor,
  fontSize,
  fontColor,
} from "../assets/DesignOption";

// FIXME: mode에 따른 색상변경 있음
// FIXME: Layout에 따른 배치 변경 있음
// justify-content - flex-start, flex-end, space-between, space-evenly (row)
// justify-content - center (column)

const height = 48; // FIXME: 추후 그리드 사이즈에 맞게 바뀔것, width도 마찬가지

const BoardText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: ${height}px;
  font-size: ${fontSize.md};
  font-family: "Pretendard-Regular";
  font-weight: 400;
  color: ${fontColor.light};
  padding: 0;
  margin: 0;

  div {
    margin: 0px 10px;
  }

  #text-value {
    font-weight: 700;
  }
`;

const Text = () => {
  return (
    <div>
      <BoardText>
        <div id="text-label">
          <span>label</span>
        </div>
        <div id="text-value">
          <span>value</span>
        </div>
      </BoardText>
    </div>
  );
};

export default Text;
