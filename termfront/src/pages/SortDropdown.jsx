import React, { useState } from "react";
import styled from "styled-components";

const DropdownWrapper = styled.div`
  position: relative;
`;

const SortBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  font-size: 14px;
  color: #212121;
  cursor: pointer;
  padding: 8px 0;
`;

const Arrow = styled.span`
  font-size: 10px;
  transition: transform 0.2s;
  transform: ${(props) => (props.$open ? "rotate(180deg)" : "rotate(0)")};
`;

const Options = styled.ul`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e5e5e5;
  list-style: none;
  padding: 0;
  margin: 0;
  min-width: 150px;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Option = styled.li`
  padding: 12px 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: ${(props) => (props.$active ? "500" : "normal")};
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const SortDropdown = ({ onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("추천순");

  const options = ["추천순", "신상품순", "낮은 가격순", "높은 가격순"];

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
    onSortChange && onSortChange(option);
  };

  return (
    <DropdownWrapper>
      <SortBtn onClick={() => setIsOpen(!isOpen)}>
        {selected}
        <Arrow $open={isOpen}>▼</Arrow>
      </SortBtn>
      {isOpen && (
        <Options>
          {options.map((option) => (
            <Option
              key={option}
              $active={option === selected}
              onClick={() => handleSelect(option)}
            >
              {option}
            </Option>
          ))}
        </Options>
      )}
    </DropdownWrapper>
  );
};

export default SortDropdown;
