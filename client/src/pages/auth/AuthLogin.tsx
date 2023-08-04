import { Button, Form, Panel, Stack } from "rsuite";
import Field from "../../field/Field";

const AuthLogin = () => {
  return (
    <div className="d-flex justify-content-center">
      <Panel header="Вход">
        <Form>
          <Field label={"E-mail"} name={"username"} />
          <Field label={"E-mail"} name={"password"} />
          <Stack>
            <Button appearance="primary">Войти</Button>
          </Stack>
        </Form>
      </Panel>
    </div>
  );
};

export default AuthLogin;
