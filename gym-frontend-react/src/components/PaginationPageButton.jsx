import styled from "styled-components";

const StyledButton = styled.a`
  @media (max-width: 320px) {
    margin-left: 5px;
    margin-right: 5px;
  }
  display: inline-block;
  padding: 10px 18px;
  margin-top: 10px;
  margin-bottom: 0;
  margin-left: 5px;
  margin-right: 5px;
  font-family: Arial, sans-serif;
  font-size: 14px;
  line-height: 20px;
  color: #ffffff;
  text-align: center;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  background-color: #0077c8;
  background-image: linear-gradient(
    rgba(255, 255, 255, 0.1) 0%,
    rgba(0, 0, 0, 0.05) 95%
  );
  background-repeat: repeat-x;
  border: 0;
  border-radius: 8px;
  box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.2);
  transition: 0.1s;
  box-sizing: border-box;

  &:hover {
    background-color: #0098ff;
    box-shadow: inset 0 -4px 0 rgba(0, 0, 0, 0.2);
    margin-top: 0px;
    padding: 10px 18px 10px;
  }

  &:active {
    box-shadow: none;
    margin-top: 2px;
    padding: 10px 18px 10px;
  }
`;

function PaginationPageButton({ onClick, pageIndex }) {
  return <StyledButton onClick={onClick}>Page {pageIndex}</StyledButton>;
}

export default PaginationPageButton;
