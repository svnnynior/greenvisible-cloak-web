import React from "react";

import "./Instruction.scss";

const Instruction: React.FC = ({ children }) => {
  return <div className="instruction-container">{children}</div>;
};

export default Instruction;
