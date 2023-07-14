import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const StyledButton = styled.a`
  @media (max-width: 320px) {
    margin-left: auto;
    margin-right: auto;
  }
  display: inline-block;
  padding: 6px 14px;
  margin-bottom: 0;
  font-family: Arial, sans-serif;
  font-size: 18px;
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
    margin-top: -2px;
    padding: 6px 14px 8px;
  }

  &:active {
    box-shadow: none;
    margin-top: 2px;
    padding: 6px 14px 4px;
  }
`;

function BookNowButtonClasses() {
  const navigate = useNavigate();
  return (
    <StyledButton onClick={() => navigate("/bookings")}>
      Book Class
    </StyledButton>
  );
}

export default BookNowButtonClasses;