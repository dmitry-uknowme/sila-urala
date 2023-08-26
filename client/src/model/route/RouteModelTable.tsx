import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { DatePicker, SelectPicker } from "rsuite";
import formatDate from "../../helpers/formatDate";
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
      start_date_localized: formatDate(route.start_date),
    }));
  });

  const spotsData = queryClient.getQueryData(["spots"]);
  const { data: carsData } = useQuery(["cars"], async () => await getCars());

  return (
    <Table
      title={`Рейсы (${data?.length ?? ""})`}
      form={{
        create: {
          title: "Добавление рейса",
          onSubmit: async (data) => {
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
            name: "end_spot_id",
            label: "Конечная точка",
            accepter: SelectPicker,
            options: spotsData?.map((spot) => ({
              label: spot.address_name,
              value: spot.id,
            })),
          },
          {
            name: "start_date",
            label: "Дата начала",
            accepter: DatePicker,
          },
          {
            name: "add_tanks5_capability",
            label: "Добавить кол-во баллонов 5л (шт.)",
          },
          {
            name: "add_tanks13_capability",
            label: "Добавить кол-во баллонов 13л (шт.)",
          },
          {
            name: "add_tanks19_capability",
            label: "Добавить кол-во баллонов 19л (шт.)",
          },
          { name: "add_capability", label: "Добавить итого (л)" },
          // {
          //   name: "start_spot_text",
          //   label: "Начальная точка",
          //   /* accepter: SelectPicker,
          //   options: spotsData?.map((spot) => ({
          //     label: spot.address_name,
          //     value: spot.id,
          //   })), */
          // },

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
        { header: "Дата начала", key: "start_date_localized" },
        { header: "Номер автомобиля", key: "car_number_plate" },
        // { header: "Начальная точка", key: "start_spot_text" },
        { header: "Конечная точка", key: "end_spot_name" },
        { header: "Статус", key: "status_localized" },
      ]}
      data={data}
      formValue={parentFormValue}
      setFormValue={setParentFormValue}
    />
  );
};

export default RouteModelTable;
