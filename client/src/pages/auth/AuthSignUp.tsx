/* eslint-disable react-refresh/only-export-components */
import { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Panel, SelectPicker, Stack } from "rsuite";
import { observer } from "mobx-react-lite";
import { AuthContext } from "../../App";
import Field from "../../field/Field";
import { UserRole, UserRoleLocalized } from "../../types/user";
import MainTemplate from "../template/MainTemplate";

const AuthLogin = ({ setFormType }) => {
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
    <Form ref={formRef} formValue={formValue} onChange={setFormValue}>
      <Field label={"E-mail"} name={"username"} />
      <Field label={"Пароль"} name={"password"} />
      <Field
        label={"Должность"}
        name={"role"}
        accepter={SelectPicker}
        data={Object.keys(UserRoleLocalized)
          .filter(
            (key) => UserRoleLocalized[key] !== UserRoleLocalized.ROLE_ADMIN
          )
          .map((key) => ({
            label: UserRoleLocalized[key],
            value: key,
          }))}
      />
      <span>
        Уже есть аккаунт?
        <a onClick={() => setFormType("signIn")}>Войти</a>
      </span>
      <Stack spacing={20}>
        <Button appearance="primary" onClick={async () => await signUp()}>
          Зарегистрироваться
        </Button>
      </Stack>
    </Form>
  );
};

export default observer(AuthLogin);
