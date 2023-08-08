import { useContext, useState } from "react";
import {
  CellProps,
  Checkbox,
  DOMHelper,
  Dropdown,
  IconButton,
  Popover,
  Table,
  Whisper,
} from "rsuite";
import EditIcon from "@rsuite/icons/Edit";
import MoreIcon from "@rsuite/icons/More";
import { ValueType } from "rsuite/esm/Checkbox";
import TableContext from "../context/TableContext";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { v4 as uuidv4 } from "uuid";

const { Column, HeaderCell, Cell } = Table;
const { getHeight } = DOMHelper;

const renderMenu = (props, ref) => {
  const {
    onClose,
    left,
    top,
    className,
    setActionType,
    rowData,
    setFormValue,
    form,
    ...rest
  } = props;

  const handleSelect = async (eventKey) => {
    if (eventKey === "UPDATE") {
      const formFields = form.fields;
      let data = { ...rowData };
      if (data?.start_date) {
        data.start_date = new Date(data.start_date);
      }
      if (data?.end_date) {
        data.end_date = new Date(data.end_date);
      }
      setFormValue(data);
      setActionType("UPDATE");
    } else if (eventKey === "REMOVE") {
      try {
        const response = await form.remove.onSubmit(rowData);
        toast.success("Запись удалена", {
          toastId: uuidv4(),
        });
        onClose();
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error?.response?.data?.statusCode === 400) {
            toast.error(
              `Ошибка при удалении записи\n${error?.response?.data?.message.join(
                "\n"
              )}`,
              {
                toastId: uuidv4(),
              }
            );
            return;
          }
        }

        toast.error("Возникла непредвиденная ошибка на сервере", {
          toastId: uuidv4(),
        });
      }
    }
    onClose();
  };
  return (
    <Popover ref={ref} className={className} style={{ left, top }} full>
      <Dropdown.Menu onSelect={handleSelect}>
        <Dropdown.Item eventKey={"UPDATE"}>Редактировать</Dropdown.Item>
        <Dropdown.Item eventKey={"REMOVE"}>Удалить</Dropdown.Item>
      </Dropdown.Menu>
    </Popover>
  );
};

export const ActionCell = (props) => {
  return (
    <Cell className="link-group" {...props}>
      <Whisper
        placement="autoVerticalEnd"
        trigger="click"
        speaker={(firstProps, ref) =>
          renderMenu({ ...firstProps, ...props }, ref)
        }
        {...props}
      >
        <IconButton appearance="subtle" icon={<MoreIcon />} />
      </Whisper>
    </Cell>
  );
};

export const CheckCell = ({
  rowData,
  onChange,
  checkedKeys,
  dataKey,
  ...props
}: CellProps & {
  checkedKeys: number[];
  onChange: (value?: ValueType, checked?: boolean) => void;
}) => (
  <Cell {...props} style={{ padding: 0 }}>
    <div style={{ lineHeight: "46px" }}>
      <Checkbox
        value={rowData[dataKey!]}
        inline
        onChange={onChange}
        checked={checkedKeys.some((item) => item === rowData[dataKey!])}
      />
    </div>
  </Cell>
);

const TableData: React.FC<{ data: [] }> = ({
  searchString,
  setSearchString,
}) => {
  const {
    data,
    formValue,
    setFormValue,
    form,
    actionType,
    setActionType,
    columnData,
  } = useContext(TableContext);
  const [checkedKeys, setCheckedKeys] = useState<ValueType[]>([]);
  const [sortColumn, setSortColumn] = useState("");
  const [sortType, setSortType] = useState<"asc" | "desc">("asc");

  let checked = false;
  let indeterminate = false;

  if (checkedKeys.length === data?.length && data.length) {
    checked = true;
  } else if (checkedKeys.length === 0) {
    checked = false;
  } else if (checkedKeys.length > 0 && checkedKeys.length < data?.length) {
    indeterminate = true;
  }

  const handleCheckAll = (_value?: ValueType, checked?: boolean) => {
    const keys = checked ? data.map((item) => item.id) : [];
    setCheckedKeys(keys);
  };
  const handleCheck = (value?: ValueType, checked?: boolean) => {
    const keys = checked
      ? [...checkedKeys, value]
      : checkedKeys.filter((item) => item !== value);
    if (keys) {
      setCheckedKeys(keys);
    }
  };

  const handleSortColumn = (sortColumn: string, sortType: "asc" | "desc") => {
    setSortColumn(sortColumn);
    setSortType(sortType);
  };

  const filteredData = () => {
    const filtered = data?.filter((item) => {
      if (
        !item[columnData[0].key]
          ?.toLowerCase()
          ?.includes(searchString.toLowerCase())
      ) {
        return false;
      }

      return true;
    });

    if (sortColumn && sortType) {
      return filtered.sort((a, b) => {
        let x: any = a[sortColumn];
        let y: any = b[sortColumn];

        if (typeof x === "string") {
          x = x.charCodeAt(0);
        }
        if (typeof y === "string") {
          y = y.charCodeAt(0);
        }

        if (sortType === "asc") {
          return x - y;
        } else {
          return y - x;
        }
      });
    }
    return filtered;
  };
  return (
    <Table
      height={250}
      // height={Math.max(getHeight(window) - 200, 400)}
      // height={Math.max((getHeight(window) - 200) / 4, 400 / 1.5)}
      data={filteredData()}
      sortColumn={sortColumn}
      sortType={sortType}
      onSortColumn={handleSortColumn}
    >
      <Column width={50} align="center" fixed>
        <HeaderCell>№</HeaderCell>
        <Cell dataKey="number" />
      </Column>

      <Column width={50} fixed>
        <HeaderCell style={{ padding: 0 }}>
          <div style={{ lineHeight: "40px" }}>
            <Checkbox
              inline
              checked={checked}
              indeterminate={indeterminate}
              onChange={handleCheckAll}
            />
          </div>
        </HeaderCell>
        <CheckCell
          dataKey="id"
          checkedKeys={checkedKeys}
          onChange={handleCheck}
        />
      </Column>
      {columnData?.map((item) => (
        <Column flexGrow={1}>
          <HeaderCell>{item.header}</HeaderCell>
          <Cell dataKey={item.key} />
        </Column>
      ))}

      <Column width={120} align="center" fixed="right">
        <HeaderCell>
          <MoreIcon />
        </HeaderCell>
        <ActionCell
          dataKey="id"
          setActionType={setActionType}
          setFormValue={setFormValue}
          form={form}
        />
      </Column>
    </Table>
  );
};

export default TableData;
