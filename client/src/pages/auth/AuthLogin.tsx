/* eslint-disable react-refresh/only-export-components */
import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Panel, SelectPicker, Stack } from "rsuite";
import { observer } from "mobx-react-lite";
import { AuthContext } from "../../App";
import Field from "../../field/Field";
import { UserRole, UserRoleLocalized } from "../../types/user";
import MainTemplate from "../template/MainTemplate";

const AuthLogin = () => {
  const navigate = useNavigate();
  const formRef = useRef();
  const [formValue, setFormValue] = useState({
    username: "",
    password: "",
    role: "",
  });

  const { auth } = useContext(AuthContext);

  const signIn = async () => {
    const result = await auth.signIn(formValue.username, formValue.password);
    if (result === true) {
      navigate("/");
    }
  };

  const signUp = async () => {
    const result = await auth.signUp(
      formValue.username,
      formValue.password,
      formValue.role as unknown as UserRole
    );
    if (result === true) {
      navigate("/");
    }
  };

  return (
    <MainTemplate>
      <div className="d-flex justify-content-center">
        <Panel bordered bodyFill shaded>
          <h3>Вход</h3>
          <div className="mt-3"></div>
          <Form ref={formRef} formValue={formValue} onChange={setFormValue}>
            <Field label={"E-mail"} name={"username"} />
            <Field label={"Пароль"} name={"password"} />
            <Field
              label={"Должность"}
              name={"role"}
              accepter={SelectPicker}
              data={Object.keys(UserRoleLocalized)
                .filter(
                  (key) =>
                    UserRoleLocalized[key] !== UserRoleLocalized.ROLE_ADMIN
                )
                .map((key) => ({
                  label: UserRoleLocalized[key],
                  value: key,
                }))}
            />
            <Stack spacing={20}>
              <Button appearance="primary" onClick={async () => await signIn()}>
                Войти
              </Button>
              <Button appearance="primary" onClick={async () => await signUp()}>
                Зарегистрироваться
              </Button>
            </Stack>
          </Form>
        </Panel>
      </div>
    </MainTemplate>
  );
};

export default observer(AuthLogin);
