import { useContext, useState } from "react";
import {
  Button,
  DOMHelper,
  Input,
  InputGroup,
  SelectPicker,
  Stack,
  Table,
} from "rsuite";
import SearchIcon from "@rsuite/icons/Search";
import TableContext from "../context/TableContext";

const TableToolbar = ({ searchString, setSearchString }) => {
  const { setActionType } = useContext(TableContext);
  return (
    <Stack className="table-toolbar" justifyContent="space-between">
      <Button
        appearance="primary"
        onClick={() => setActionType("CREATE")}
        size="sm"
      >
        Добавить запись
      </Button>

      <Stack spacing={6}>
        {/* <SelectPicker
                    label="Rating"
                    data={ratingList}
                    searchable={false}
                    value={rating}
                    onChange={setRating}
                /> */}
        <InputGroup inside>
          <Input
            value={searchString}
            onChange={setSearchString}
            placeholder="Поиск"
          />
          <InputGroup.Addon>
            <SearchIcon />
          </InputGroup.Addon>
        </InputGroup>
      </Stack>
    </Stack>
  );
};

export default TableToolbar;
