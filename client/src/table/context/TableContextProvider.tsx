import { useState } from "react";
import TableContext, { ITableContext } from "./TableContext";

const TableContextProvider = ({ children, value }) => {
  const [actionType, setActionType] = useState(null);

  return (
    <TableContext.Provider value={{ actionType, setActionType, ...value }}>
      {children}
    </TableContext.Provider>
  );
};

export default TableContextProvider;
