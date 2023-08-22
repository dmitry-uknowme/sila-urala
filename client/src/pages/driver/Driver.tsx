import { useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { Nav, Panel, SelectPicker } from "rsuite";
import { AuthContext } from "../../App";
import getCars from "../../model/car/api/getCars";
import getRoutes from "../../model/route/api/getRoutes";
import { RouteStatus, RouteStatusLocalized } from "../../types/route";
import MainTemplate from "../template/MainTemplate";
import { v4 as uuidv4 } from "uuid";
import RouteCard from "./RouteCard";
import EditIcon from "@rsuite/icons/Edit";
import updateUser from "../../model/user/api/updateUser";
import getUser from "../../model/user/api/getUser";
import Table from "../../table";

const Driver = () => {
  const { auth } = useContext(AuthContext);
  const [activeNav, setActiveNav] = useState<"current" | "completed" | "cars">(
    "current"
  );
  const [driverFormType, setDriverFormType] = useState(null);

  const queryClient = useQueryClient();
  const user = auth?.session?.user!;
  const userId = user?.id;

  const driver = useQuery(
    ["driver", userId],
    async () => await getUser(userId),
    { enabled: !!userId }
  );

  const driverCars = useQuery(
    ["driverCars", userId],
    async () => await getCars({ user_id: userId }),
    { enabled: !!userId }
  );
  const currentCar = driverCars?.data?.length ? driverCars?.data[0] : null;
  const currentCarId = currentCar?.id;

  const [filter, setFilter] = useState({
    car_id: currentCarId,
    OR: [
      {
        status: {
          equals: RouteStatus.STATUS_ACTIVE,
        },
      },
      {
        status: {
          equals: RouteStatus.STATUS_STARTED,
        },
      },
    ],
  });

  const carRoutes = useQuery(
    ["driverRoutes", filter],
    async () => await getRoutes(filter),
    { enabled: !!currentCarId }
  );

  const { data: carsData } = useQuery(["cars"], async () => await getCars());

  const currentRoute = carRoutes?.data?.length
    ? carRoutes?.data?.find(
        (route) =>
          route.status === RouteStatus.STATUS_ACTIVE ||
          route.status === RouteStatus.STATUS_STARTED
      )
    : null;
  const currentRouteId = currentRoute?.id;

  const plannedRoutes = carRoutes?.data?.filter(
    (route) => route.id !== currentRouteId
  );

  const completedRoutes = queryClient.getQueryData([
    "driverRoutes",
    {
      car_id: currentCarId,
      OR: [
        {
          status: {
            equals: RouteStatus.STATUS_COMPLETED,
          },
        },
      ],
    },
  ]);

  console.log("dadad", completedRoutes);

  const [driverFormValue, setDriverFormValue] = useState(driver?.data);

  useEffect(() => {
    if (driverFormType !== "UPDATE") {
      setDriverFormValue(driver?.data);
    }
  }, [userId, driverFormType]);

  return (
    <MainTemplate>
      <div className="driver-page">
        {driverFormType === "UPDATE" ? (
          <Table
            actionType={driverFormType}
            setActionType={setDriverFormType}
            form={{
              update: {
                title: "Сменить автомобиль",
                onSubmit: async (data) => {
                  const driverId = userId;
                  const response = await updateUser(driverId, {
                    car_id: data.car_id,
                  });
                  await queryClient.invalidateQueries(["driverCars"]);
                  return response;
                },
              },
              fields: [
                {
                  name: "car_id",
                  label: "Выберите автомобиль",
                  accepter: SelectPicker,
                  options: carsData?.map((car) => ({
                    label: car.number_plate,
                    value: car.id,
                  })),
                },
              ],
            }}
            formValue={driverFormValue}
            setFormValue={setDriverFormValue}
          />
        ) : null}
        <Panel
          bordered
          bodyFill
          shaded
          style={{ padding: "2rem", display: "flex", alignItems: "center" }}
        >
          {user ? (
            <h3>
              Водитель {user?.username}{" "}
              <span onClick={() => setDriverFormType("UPDATE")}>
                {currentCar?.number_plate}{" "}
                <EditIcon style={{ fontSize: "1.3rem" }} />
              </span>
            </h3>
          ) : null}

          <Nav appearance="subtle" justified>
            <Nav.Item
              active={activeNav === "current"}
              onSelect={(key) => {
                setFilter({
                  car_id: currentCarId,
                  OR: [
                    {
                      status: {
                        equals: RouteStatus.STATUS_ACTIVE,
                      },
                    },
                    {
                      status: {
                        equals: RouteStatus.STATUS_STARTED,
                      },
                    },
                  ],
                });
                setActiveNav(key);
              }}
            >
              Запланированные рейсы ({carRoutes?.data?.length})
            </Nav.Item>
            <Nav.Item
              active={activeNav === "completed"}
              onSelect={(key) => {
                setFilter({
                  car_id: currentCarId,
                  OR: [
                    {
                      status: {
                        equals: RouteStatus.STATUS_COMPLETED,
                      },
                    },
                  ],
                });
                setActiveNav(key);
              }}
            >
              Завершенные рейсы
            </Nav.Item>
            <Nav.Item>Автомобили</Nav.Item>
          </Nav>
          <div className="mt-3">
            {currentRoute ? (
              <>
                <RouteCard
                  user={user}
                  route={currentRoute}
                  routeName={"Текущий рейс"}
                />
              </>
            ) : (
              <b>Нет активных рейсов</b>
            )}
            <Panel
              header={`Следующие рейсы (${plannedRoutes?.length})`}
              collapsible
              bordered
            >
              <div
                style={{
                  opacity: "0.7",
                  pointerEvents: "none",
                  cursor: "not-allowed",
                }}
              >
                {plannedRoutes?.map((route) => (
                  <RouteCard user={user} route={route} routeName={"Рейс №1"} />
                ))}
              </div>
            </Panel>
          </div>
        </Panel>
      </div>
    </MainTemplate>
  );
};

export default Driver;
