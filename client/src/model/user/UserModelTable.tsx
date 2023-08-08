import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { SelectPicker } from "rsuite";
import Table from "../../table";
import { UserRoleLocalized } from "../../types/user";
import getCars from "../car/api/getCars";
import getSpots from "../spot/api/getSpots";
import createUser from "./api/createUser";
import getUsers from "./api/getUsers";
import removeUser from "./api/removeUser";
import updateUser from "./api/updateUser";
import { IUser } from "./user";

const UserModelTable = () => {
  const [parentFormValue, setParentFormValue] = useState({} as User);
  const queryClient = useQueryClient();
  const { data, isFetching } = useQuery(["users"], async () => {
    const users = await getUsers();
    return users.map((user: IUser) => ({
      ...user,
      role_localized: UserRoleLocalized[user.role],
      spot_address_name: user?.spot?.address_name,
      car_id: user?.cars?.length ? user.cars[0]?.id : null,
      car_number_plate: user?.cars?.length ? user.cars[0]?.number_plate : null,
      full_name: `${user.last_name} ${user.first_name} ${user.middle_name}`,
    }));
  });

  const spotsData = queryClient.getQueryData(["spots"]);
  const { data: carsData } = useQuery(["cars"], async () => await getCars());
  return (
    <Table
      title={`Сотрудники (${data?.length ?? ""})`}
      form={{
        create: {
          title: "Добавление сотрудника",
          onSubmit: async (data) => {
            const response = await createUser({
              ...data,
            });
            await queryClient.invalidateQueries(["users"]);
            return response;
          },
        },
        update: {
          title: "Редактирование сотрудника",
          onSubmit: async (data) => {
            const userId = parentFormValue.id;
            const response = await updateUser(userId, {
              ...data,
            });
            await queryClient.invalidateQueries(["users"]);
            return response;
          },
        },
        remove: {
          onSubmit: async (data) => {
            const userId = data.id;
            const response = await removeUser(userId);
            await queryClient.invalidateQueries(["users"]);
            return response;
          },
        },
        fields: [
          { name: "last_name", label: "Фамилия" },
          { name: "first_name", label: "Имя" },
          { name: "middle_name", label: "Отчество" },
          { name: "username", label: "Email" },
          { name: "password", label: "Пароль" },
          {
            name: "role",
            label: "Должность",
            accepter: SelectPicker,
            options: Object.keys(UserRoleLocalized).map((key) => ({
              label: UserRoleLocalized[key],
              value: key,
            })),
          },
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
            name: "spot_id",
            label: "Адрес точки",
            accepter: SelectPicker,
            options: spotsData?.map((spot) => ({
              label: spot.address_name,
              value: spot.id,
            })),
          },
        ],
      }}
      columnData={[
        { header: "ФИО", key: "full_name" },
        { header: "Должность", key: "role_localized" },
        { header: "Название точки", key: "spot_address_name" },
        { header: "Номер автомобиля", key: "car_number_plate" },
      ]}
      data={data}
      formValue={parentFormValue}
      setFormValue={setParentFormValue}
      // setActionType={setActionType}
    />
  );
};

export default UserModelTable;
