/* eslint-disable react-refresh/only-export-components */
import { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Panel, SelectPicker, Stack } from "rsuite";
import { observer } from "mobx-react-lite";
import { AuthContext } from "../../App";
import Field from "../../field/Field";
import { UserRole, UserRoleLocalized } from "../../types/user";
import MainTemplate from "../template/MainTemplate";
import AuthSignIn from "./AuthSignIn";
import AuthSignUp from "./AuthSignUp";

const Auth = () => {
  const [formType, setFormType] = useState<"signIn" | "signUp">("signIn");
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
        <Panel bordered bodyFill shaded style={{ padding: "2rem" }}>
          <h3 style={{ fontWeight: 700 }}>
            {formType === "signUp" ? "Регистрация" : "Вход"}
          </h3>
          <div className="mt-3"></div>
          {formType === "signUp" ? (
            <AuthSignUp setFormType={setFormType} />
          ) : (
            <AuthSignIn setFormType={setFormType} />
          )}
        </Panel>
      </div>
    </MainTemplate>
  );
};

export default observer(Auth);
