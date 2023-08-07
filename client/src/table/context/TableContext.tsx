import { AxiosResponse } from "axios";
import { createContext } from "react";
import { IUser } from "../../model/user/user";

interface IFormField {
  name: string;
  label: string;
  accepter?: React.ReactNode;
  options?: { label: string; value: string | number }[];
}

type Model = IUser;

export interface ITableContext<Model> {
  setActionType: React.Dispatch<
    React.SetStateAction<"CREATE" | "UPDATE" | null>
  >;
  actionType: "CREATE" | "UPDATE" | null;
  formValue: Model;
  setFormValue: React.Dispatch<React.SetStateAction<Model>>;
  form: {
    fields: IFormField[];
    create: { title: string; onSubmit: (data: any) => Promise<AxiosResponse> };
    update: { title: string; onSubmit: (data: any) => Promise<AxiosResponse> };
    remove: { onSubmit: (data: any) => Promise<AxiosResponse> };
  };
  validationSchema: any;
  title: string;
  data: [];
  columnData: { header: string; key: string }[];
}

const TableContext = createContext<ITableContext<Model>>(
  null as unknown as ITableContext<Model>
);

export default TableContext;
