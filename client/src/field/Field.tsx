import { Form } from "rsuite";

const Field = ({ name, label, accepter, errorMessage, helpText, ...rest }) => {
  return (
    <Form.Group controlId={name}>
      <Form.ControlLabel>{label} </Form.ControlLabel>
      <Form.Control
        name={name}
        accepter={accepter}
        {...rest}
        format="yyyy-MM-dd HH:mm"
        placement={"autoVerticalStart"}
      />
      {helpText ? <Form.HelpText>{helpText}</Form.HelpText> : null}
      <Form.ErrorMessage>{errorMessage}</Form.ErrorMessage>
    </Form.Group>
  );
};

export default Field;
