/* eslint-disable react-refresh/only-export-components */
import { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Panel, SelectPicker, Stack, Schema } from "rsuite";
import { observer } from "mobx-react-lite";
import { AuthContext } from "../../App";
import Field from "../../field/Field";
import { UserRole, UserRoleLocalized } from "../../types/user";
import { toast } from "react-toastify";

const { StringType } = Schema.Types;

const AuthSignUp = ({ setFormType }) => {
  const navigate = useNavigate();
  const formRef = useRef();
  const [formValue, setFormValue] = useState({
    username: "",
    password: "",
    role: "",
  });

  const [formError, setFormError] = useState({});

  const { auth } = useContext(AuthContext);

  const signUp = async () => {
    if (!formRef.current.check()) {
      toast.error("Заполните обязательные поля");
      return;
    }
    const result = await auth.signUp(
      formValue.username,
      formValue.password,
      formValue.role as unknown as UserRole
    );
    if (result === true) {
      navigate("/");
    }
  };

  const validateModel = Schema.Model({
    username: StringType().isRequired("Обязательно для заполнения"),
    password: StringType().isRequired("Обязательно для заполнения"),
    role: StringType()
      .isOneOf(Object.keys(UserRole), "Недопустимое значение")
      .isRequired("Обязательно для заполнения"),
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
        errorMessage={formError.role}
      />
      <div className="my-3">
        Уже есть аккаунт?{" "}
        <a className="text-primary" onClick={() => setFormType("signIn")}>
          Войти
        </a>
      </div>
      <Stack spacing={20}>
        <Button appearance="primary" onClick={async () => await signUp()}>
          Зарегистрироваться
        </Button>
      </Stack>
    </Form>
  );
};

export default observer(AuthSignUp);
