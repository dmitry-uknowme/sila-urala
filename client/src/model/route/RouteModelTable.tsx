import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { SelectPicker } from "rsuite";
import Table from "../../table";
import { RouteStatusLocalized } from "../../types/route";
import getCars from "../car/api/getCars";
import getSpots from "../spot/api/getSpots";
import removeRoute from "../user/api/removeUser";
import createRoute from "./api/createRoute";
import getRoutes from "./api/getRoutes";
import updateRoute from "./api/updateRoute";

const RouteModelTable = () => {
  const [parentFormValue, setParentFormValue] = useState({});
  const queryClient = useQueryClient();
  const { data, isFetching } = useQuery(["routes"], async () => {
    const routes = await getRoutes();
    return routes.map((route) => ({
      ...route,
      car_number_plate: route?.car?.number_plate ?? null,
      end_spot_name: route?.end_spot?.address_name ?? null,
      status_localized: RouteStatusLocalized[route.status],
    }));
  });

  const { data: spotsData } = useQuery(["spots"], async () => await getSpots());
  const { data: carsData } = useQuery(["cars"], async () => await getCars());

  return (
    <Table
      title={`Рейсы (${data?.length})`}
      form={{
        create: {
          title: "Добавление рейса",
          onSubmit: async (data) => {
            console.log("on subbb", data);
            const response = await createRoute(data.car_id, {
              ...data,
            });
            await queryClient.invalidateQueries(["routes"]);
            return response;
          },
        },
        update: {
          title: "Редактирование рейса",
          onSubmit: async (data) => {
            const routeId = parentFormValue.id;
            const response = await updateRoute(routeId, {
              ...data,
            });
            await queryClient.invalidateQueries(["routes"]);
            return response;
          },
        },
        remove: {
          onSubmit: async (data) => {
            const routeId = parentFormValue.id;
            const response = await removeRoute(routeId);
            await queryClient.invalidateQueries(["routes"]);
            return response;
          },
        },
        fields: [
          {
            name: "car_id",
            label: "Номер автомобиля",
            accepter: SelectPicker,
            options: carsData?.map((car) => ({
              label: car.number_plate,
              value: car.id,
            })),
          },
          {
            name: "start_spot_text",
            label: "Начальная точка",
            /* accepter: SelectPicker,
            options: spotsData?.map((spot) => ({
              label: spot.address_name,
              value: spot.id,
            })), */
          },
          {
            name: "end_spot_id",
            label: "Конечная точка",
            accepter: SelectPicker,
            options: spotsData?.map((spot) => ({
              label: spot.address_name,
              value: spot.id,
            })),
          },
          {
            name: "status",
            label: "Статус",
            accepter: SelectPicker,
            options: Object.keys(RouteStatusLocalized).map((key) => ({
              label: RouteStatusLocalized[key],
              value: key,
            })),
          },
        ],
      }}
      columnData={[
        { header: "Номер автомобиля", key: "car_number_plate" },
        { header: "Начальная точка", key: "start_spot_text" },
        { header: "Конечная точка", key: "end_spot_name" },
        { header: "Статус", key: "status_localized" },
        { header: "Дата создания", key: "created_at" },
      ]}
      data={data}
      formValue={parentFormValue}
      setFormValue={setParentFormValue}
    />
  );
};

export default RouteModelTable;
