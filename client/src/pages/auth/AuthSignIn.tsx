/* eslint-disable react-refresh/only-export-components */
import { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Panel, SelectPicker, Stack, Schema } from "rsuite";
import { observer } from "mobx-react-lite";
import { AuthContext } from "../../App";
import Field from "../../field/Field";
import { UserRole, UserRoleLocalized } from "../../types/user";

const { StringType } = Schema.Types;

const AuthSignIn = ({ setFormType }) => {
  const navigate = useNavigate();
  const formRef = useRef();
  const [formValue, setFormValue] = useState({
    username: "",
    password: "",
  });

  const [formError, setFormError] = useState({});

  const { auth } = useContext(AuthContext);

  const signIn = async () => {
    if (!formRef.current.check()) {
      toast.error("Заполните обязательные поля");
      return;
    }
    const result = await auth.signIn(formValue.username, formValue.password);
    if (result === true) {
      navigate("/");
    }
  };

  const validateModel = Schema.Model({
    username: StringType().isRequired("Обязательно для заполнения"),
    password: StringType().isRequired("Обязательно для заполнения"),
  });

  return (
    <Form
      ref={formRef}
      formValue={formValue}
      onChange={setFormValue}
      onCheck={setFormError}
      model={validateModel}
      checkTrigger="change"
    >
      <Field
        label={"E-mail"}
        name={"username"}
        errorMessage={formError.username}
      />
      <Field
        label={"Пароль"}
        name={"password"}
        errorMessage={formError.password}
      />
      <div className="my-3">
        Еще нет аккаунта?{" "}
        <a className="text-primary" onClick={() => setFormType("signUp")}>
          Регистрация
        </a>
      </div>
      <Stack spacing={20}>
        <Button appearance="primary" onClick={async () => await signIn()}>
          Войти
        </Button>
      </Stack>
    </Form>
  );
};

export default observer(AuthSignIn);
