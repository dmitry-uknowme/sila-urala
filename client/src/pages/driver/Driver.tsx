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
  const [activeNav, setActiveNav] = useState<"active" | "completed" | "cars">(
    "active"
  );

  const queryClient = useQueryClient();
  const user = auth?.session?.user!;
  const userId = user?.id;

  const driver = useQuery(
    ["driver", userId],
    async () => await getUser(userId),
    { enabled: !!userId }
  );

  const currentCar = driver?.data?.car;
  const currentCarId = currentCar?.id;

  const activeRoutes = useQuery(
    ["activeRoutes"],
    async () =>
      await getRoutes({
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
      }),
    { enabled: !!currentCarId }
  );

  const completedRoutes = useQuery(
    ["completedRoutes"],
    async () =>
      await getRoutes({
        car_id: currentCarId,
        OR: [
          {
            status: {
              equals: RouteStatus.STATUS_COMPLETED,
            },
          },
        ],
      }),
    { enabled: !!currentCarId }
  );

  const { data: carsData } = useQuery(["cars"], async () => await getCars());

  const currentRoute = activeRoutes?.data?.length
    ? activeRoutes?.data?.find(
        (route) =>
          route.status === RouteStatus.STATUS_ACTIVE ||
          route.status === RouteStatus.STATUS_STARTED
      )
    : null;
  const currentRouteId = currentRoute?.id;

  const plannedRoutes = activeRoutes?.data?.filter(
    (route) => route.id !== currentRouteId
  );

  const [driverFormValue, setDriverFormValue] = useState(driver?.data);
  const [driverFormType, setDriverFormType] = useState(null);

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
                  await queryClient.invalidateQueries(["driver"]);
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
              active={activeNav === "active"}
              onSelect={(key) => {
                setActiveNav("active");
              }}
            >
              Запланированные рейсы ({activeRoutes?.data?.length})
            </Nav.Item>
            <Nav.Item
              active={activeNav === "completed"}
              onSelect={(key) => {
                setActiveNav("completed");
              }}
            >
              Завершенные рейсы
            </Nav.Item>
          </Nav>
          <div className="mt-3">
            {activeNav === "active" ? (
              <>
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
                {plannedRoutes?.length ? (
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
                        <RouteCard
                          user={user}
                          route={route}
                          routeName={"Рейс №1"}
                        />
                      ))}
                    </div>
                  </Panel>
                ) : null}
              </>
            ) : activeNav === "completed" ? (
              completedRoutes?.data?.map((route, num) => (
                <RouteCard
                  user={user}
                  route={route}
                  routeName={`Рейс №${num + 1}`}
                />
              ))
            ) : null}
          </div>
        </Panel>
      </div>
    </MainTemplate>
  );
};

export default Driver;
