import { Form } from "rsuite";

const Field = ({ name, label, accepter, errorMessage, ...rest }) => {
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
      <Form.HelpText>{errorMessage}</Form.HelpText>
    </Form.Group>
  );
};

export default Field;
