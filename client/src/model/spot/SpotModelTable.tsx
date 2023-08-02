import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import Table from "../../table";
import createSpot from "./api/createSpot";
import getSpots from "./api/getSpots";
import removeSpot from "./api/removeSpot";
import updateSpot from "./api/updateSpot";

const SpotModelTable = () => {
  const [parentFormValue, setParentFormValue] = useState({});
  const queryClient = useQueryClient();
  const { data, isFetching } = useQuery(
    ["spots"],
    async () => await getSpots()
  );
  return (
    <Table
      title={`Точки (${data?.length})`}
      form={{
        create: {
          title: "Добавление точки",
          onSubmit: async (data) => {
            console.log("on subbb", data);
            const response = await createSpot({
              ...data,
              capability: parseFloat(data.capability),
            });
            await queryClient.invalidateQueries(["spots"]);
            return response;
          },
        },
        update: {
          title: "Редактирование точки",
          onSubmit: async (data) => {
            const carId = parentFormValue.id;
            const response = await updateSpot(carId, {
              ...data,
              capability: parseFloat(data.capability),
            });
            await queryClient.invalidateQueries(["spots"]);
            return response;
          },
        },
        remove: {
          onSubmit: async (data) => {
            const carId = data.id;
            const response = await removeSpot(carId);
            await queryClient.invalidateQueries(["spots"]);
            return response;
          },
        },
        fields: [
          { name: "address_name", label: "Адрес" },
          { name: "capability", label: "Вместимость" },
          { name: "coordinates", label: "Координаты" },
        ],
      }}
      columnData={[
        { header: "Адрес", key: "address_name" },
        { header: "Вместимость", key: "capability" },
        { header: "Координаты", key: "coordinates" },
      ]}
      data={data}
      formValue={parentFormValue}
      setFormValue={setParentFormValue}
    />
  );
};

export default SpotModelTable;
