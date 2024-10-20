import React from "react";
import { Col, Row } from "react-bootstrap";
import Calculator from "./components/Calculator/Calculator";
import SecretSanta from "./components/SecretSanta/SecretSanta";
import Sudoku from "./components/Sudoku/Sudoku";
import RubikTimer from "./components/RubikTimer/RubikTimer";
import Shopping from "./components/Shopping/Shopping";
import "./App.css"

const App = () => {
  return (
    <Row>
      <Col>
        <Shopping />
      </Col>
      <Col>
        <RubikTimer />
      </Col>
      <Col>
        <Sudoku />
      </Col>
      <Col>
        <SecretSanta />
      </Col>
      <Col>
        <Calculator />
      </Col>
    </Row>
  );
}

export default App;
