import React from "react";

import "./Instruction.scss";

interface Props {
  handleBack: () => void;
  closeInstruction: () => void;
}
const Instruction: React.FC<Props> = ({
  handleBack,
  closeInstruction,
  children,
}) => {
  return (
    <div className="instruction-container">
      <h1 className="text-center">{children}</h1>
      <div style={{ display: "flex" }}>
        <button
          className="open-button"
          onClick={() => {
            handleBack();
            closeInstruction();
          }}
        >
          Back
        </button>
        <button className="open-button" onClick={closeInstruction}>
          Got It !
        </button>
      </div>
    </div>
  );
};

export default Instruction;
