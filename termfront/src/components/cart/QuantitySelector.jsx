import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #e0e0e0;
  width: fit-content;
`;

const Button = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: none;
  font-size: 18px;
  color: #212121;
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }

  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
`;

const Count = styled.span`
  min-width: 40px;
  text-align: center;
  font-size: 14px;
  color: #212121;
`;

const QuantitySelector = ({ quantity, onChange }) => {
  return (
    <Container>
      <Button onClick={() => onChange(quantity - 1)} disabled={quantity <= 1}>
        −
      </Button>
      <Count>{quantity}</Count>
      <Button onClick={() => onChange(quantity + 1)}>+</Button>
    </Container>
  );
};

export default QuantitySelector;
