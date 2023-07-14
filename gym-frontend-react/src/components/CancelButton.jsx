import React from "react";
import styled from "styled-components";

const StyledCancelButton = styled.button`
  display: inline-block;
  padding: 6px 14px;
  margin-bottom: 0;
  font-family: Arial, sans-serif;
  font-size: 14px;
  line-height: 20px;
  color: #ffffff;
  text-align: center;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  background-color: #cb0307;
  background-image: linear-gradient(
    rgba(255, 255, 255, 0.1),
    rgba(0, 0, 0, 0.05) 95%
  );
  background-repeat: repeat-x;
  border: 0;
  border-radius: 8px;
  box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.2);
  transition: 0.1s;
  box-sizing: border-box;

  &:hover {
    background-color: #cb0307;
    box-shadow: inset 0 -4px 0 rgba(0, 0, 0, 0.2);
    margin-top: -2px;
    padding: 6px 14px 8px;
  }

  &:active {
    box-shadow: none;
    margin-top: 2px;
    padding: 6px 14px 4px;
  }

  &:disabled {
    background-color: #999;
    cursor: not-allowed;
  }
`;

function CancelButton({ onClick, disabled }) {
  return (
    <StyledCancelButton onClick={onClick} disabled={disabled}>
      Cancel
    </StyledCancelButton>
  );
}

export default CancelButton;
