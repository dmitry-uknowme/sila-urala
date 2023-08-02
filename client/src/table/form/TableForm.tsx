import { useContext, useEffect, useRef, useState } from "react";
import { Button, Drawer, DrawerProps, Form, Input } from "rsuite";
import { toast } from "react-toastify";
import Field from "../../field/Field";
import { AxiosError } from "axios";
import TableContext from "../context/TableContext";

// interface IFormField {
//   name: string;
//   label: string;
//   accepter?: React.ReactNode;
//   options?: { label: string; value: string | number }[];
// }

// export interface TableFormProps<Model> extends DrawerProps {
//   actionType: "CREATE" | "UPDATE";
//   parentFormValue: Model;
//   setParentFormValue: React.Dispatch<React.SetStateAction<Model>>;
//   form: {
//     fields: IFormField[];
//     create: { title: string; onSubmit: (data: any) => Promise<AxiosResponse> };
//     update: { title: string; onSubmit: (data: any) => Promise<AxiosResponse> };
//   };
//   validationSchema: any;
// }

const TableForm: React.FC<DrawerProps> = (props) => {
  const { ...rest } = props;
  const context = useContext(TableContext);
  const { formValue, setFormValue, form, actionType, setActionType } = context;
  const formFields = form.fields;

  const formRef = useRef();
  const [formError, setFormError] = useState({});
  useEffect(() => {
    if (actionType === "CREATE") {
      setFormValue(
        formFields.reduce((acc, curr) => ((acc[curr.name] = ""), acc), {})
      );
    }
    //  else if (actionType==='UPDATE') {
    // setF
    //  }
  }, [actionType]);

  const onClose = () => {
    setActionType(null);
  };

  const handleSubmit = async () => {
    const data = Object.keys(formValue)
      .map((key) => ({ key, value: formValue[key] }))
      .filter((item) => formFields.find((field) => field.name === item.key))
      .reduce(
        (acc, curr: { key: string; value: string }) => (
          (acc[curr.key] = curr.value), acc
        ),
        {}
      );
    // const data = Object.keys(formValue)
    //   .map((key) => ({
    //     key,
    //     value: formValue[key].trim() === "" ? null : formValue[key].trim(),
    //   }))
    //   .reduce((acc, curr) => ((acc[curr.key] = curr.value), acc), {});
    // console.log("prevvvvvddd", data);
    if (actionType === "CREATE") {
      try {
        const response = await form.create.onSubmit(data);
        toast.success("Запись добавлена");
        onClose();
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error?.response?.data?.statusCode === 400) {
            toast.error(
              `Ошибка при добавлении записи\n${error?.response?.data?.message.join(
                "\n"
              )}`
            );
            return;
          }
        }

        toast.error("Возникла непредвиденная ошибка на сервере");
      }
    } else if (actionType === "UPDATE") {
      try {
        const response = await form.update.onSubmit(data);
        toast.success("Запись обновлена");
        onClose();
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error?.response?.data?.statusCode === 400) {
            toast.error(
              `Ошибка при обновлении записи\n${error?.response?.data?.message.join(
                "\n"
              )}`
            );
            return;
          }
        }

        toast.error("Возникла непредвиденная ошибка на сервере");
      }
    }
  };

  return (
    <Drawer
      backdrop="static"
      size="md"
      placement="right"
      onClose={onClose}
      open={!!actionType}
      {...rest}
    >
      <Drawer.Header>
        <Drawer.Title>
          {actionType === "CREATE"
            ? form?.create?.title
            : actionType === "UPDATE"
            ? form?.update?.title
            : null}
        </Drawer.Title>
        <Drawer.Actions>
          <Button onClick={handleSubmit} appearance="primary">
            {actionType === "CREATE" ? "Добавить" : "Сохранить"}
          </Button>
          <Button onClick={onClose} appearance="subtle">
            Отменить
          </Button>
        </Drawer.Actions>
      </Drawer.Header>

      <Drawer.Body>
        <Form
          ref={formRef}
          onChange={setFormValue}
          onCheck={setFormError}
          formValue={formValue}
          fluid
        >
          {formFields?.map((field: IFormField) => (
            <Field
              name={field.name}
              label={field.label}
              accepter={field?.accepter || Input}
              data={field?.options || []}
            />
          ))}
        </Form>
      </Drawer.Body>
    </Drawer>
  );
};

export default TableForm;
