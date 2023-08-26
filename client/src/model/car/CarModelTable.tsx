import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import Table from "../../table";
import createCar from "./api/createCar";
import getCars from "./api/getCars";
import removeCar from "./api/removeCar";
import updateCar from "./api/updateCar";

const CarModelTable = () => {
  const [parentFormValue, setParentFormValue] = useState({});
  const queryClient = useQueryClient();
  const { data, isFetching } = useQuery(["cars"], async () => await getCars());
  return (
    <Table
      title={`Автомобили (${data?.length ?? ""})`}
      form={{
        create: {
          title: "Добавление автомобиля",
          onSubmit: async (data) => {
            const response = await createCar({
              ...data,
              capability: parseFloat(data.capability),
            });
            await queryClient.invalidateQueries(["cars"]);
            return response;
          },
        },
        update: {
          title: "Редактирование автомобиля",
          onSubmit: async (data) => {
            const carId = parentFormValue.id;
            const response = await updateCar(carId, {
              ...data,
              capability: parseFloat(data.capability),
            });
            await queryClient.invalidateQueries(["cars"]);
            return response;
          },
        },
        remove: {
          onSubmit: async (data) => {
            const carId = data.id;
            const response = await removeCar(carId);
            await queryClient.invalidateQueries(["cars"]);
            return response;
          },
        },
        fields: [
          { name: "number_plate", label: "Гос. номер" },
          { name: "capability", label: "Вместимость" },
        ],
      }}
      columnData={[
        { header: "Гос. номер", key: "number_plate" },
        { header: "Вместимость (л)", key: "capability" },
      ]}
      data={data}
      formValue={parentFormValue}
      setFormValue={setParentFormValue}
    />
  );
};

export default CarModelTable;
