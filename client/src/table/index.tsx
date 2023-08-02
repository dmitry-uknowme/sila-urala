import { useState } from "react";
import { User } from "../model/user/user";
import TableContext, { ITableContext } from "./context/TableContext";
import TableContextProvider from "./context/TableContextProvider";
import TableData from "./data/TableData";
import TableForm, { TableFormProps } from "./form/TableForm";
import TableToolbar from "./toolbar/TableToolbar";

interface TableProps<Model> extends TableFormProps<Model> {
  title: string;
  data: [];
  columnData: { header: string; key: string }[];
}

type Model = User;

const Table: React.FC<ITableContext<Model>> = (props) => {
  const { title, data, columnData, form, actionType, setActionType } = props;
  const [searchString, setSearchString] = useState("");

  return (
    <TableContextProvider value={props}>
      <h3>{title}</h3>
      <TableToolbar
        searchString={searchString}
        setSearchString={setSearchString}
      />
      <TableData
        searchString={searchString}
        setSearchString={setSearchString}
        {...props}
      />
      <TableForm
        // form={form}
        {...props}
      />
    </TableContextProvider>
  );
};
export default Table;
