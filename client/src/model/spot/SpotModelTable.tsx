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
  const { data, isFetching } = useQuery(["spots"], async () => {
    const spots = await getSpots();

    return spots.map((spot) => ({
      ...spot,
      capability_localized: `${spot.capability}/${spot.max_capability} (5л-${spot.tanks5_capability}шт, 13л-${spot.tanks13_capability}шт,19л-${spot.tanks19_capability}шт)`,
      closest_route_date: spot?.routes?.length
        ? `${new Date(
            spot.routes[0].start_date
          ).toLocaleDateString()} ${new Date(
            spot.routes[0].start_date
          ).toLocaleTimeString()}`
        : null,
    }));
  });

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
              max_capability: parseFloat(data.max_capability),
              tanks5_capability: parseFloat(data.tanks5_capability),
              tanks13_capability: parseFloat(data.tanks13_capability),
              tanks19_capability: parseFloat(data.tanks19_capability),
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
              max_capability: parseFloat(data.max_capability),
              tanks5_capability: parseFloat(data.tanks5_capability),
              tanks13_capability: parseFloat(data.tanks13_capability),
              tanks19_capability: parseFloat(data.tanks19_capability),
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
          { name: "max_capability", label: "Макс. вместимость" },
          { name: "tanks5_capability", label: "Кол-во баллонов 5л (шт.)" },
          { name: "tanks13_capability", label: "Кол-во баллонов 13л (шт.)" },
          { name: "tanks19_capability", label: "Кол-во баллонов 19л (шт.)" },
          { name: "capability", label: "Текущая вместимость (л)" },
          // { name: "coordinates", label: "Координаты" },
        ],
      }}
      columnData={[
        { header: "Адрес", key: "address_name" },
        { header: "Текущая вместимость (л)", key: "capability_localized" },
        { header: "Добавлено за сегодня (л)", key: "capability_added_today" },
        { header: "Ближайший рейс", key: "closest_route_date" },
        // { header: "Координаты", key: "coordinates" },
      ]}
      data={data}
      formValue={parentFormValue}
      setFormValue={setParentFormValue}
    />
  );
};

export default SpotModelTable;
