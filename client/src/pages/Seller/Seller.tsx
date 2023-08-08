import { useContext, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { Button, List, Nav, Panel } from "rsuite";
import { AuthContext } from "../../App";
import getCars from "../../model/car/api/getCars";
import getRoutes from "../../model/route/api/getRoutes";
import updateRoute from "../../model/route/api/updateRoute";
import { RouteStatus, RouteStatusLocalized } from "../../types/route";
import MainTemplate from "../template/MainTemplate";
import { v4 as uuidv4 } from "uuid";
import driverCompleteRoute from "../../model/route/api/driverCompleteRoute";
import driverStartRoute from "../../model/route/api/driverStartRoute";
import RouteCard from "./RouteCard";

const Driver = () => {
  const { auth } = useContext(AuthContext);
  const [activeNav, setActiveNav] = useState<"current" | "completed" | "cars">(
    "current"
  );
  const queryClient = useQueryClient();
  const user = auth?.session?.user!;
  const userId = user?.id;

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
    // status: RouteStatus.STATUS_ACTIVE,
  });
  const carRoutes = useQuery(
    ["driverRoutes", filter],
    async () => await getRoutes(filter),
    { enabled: !!currentCarId }
  );

  const currentRoute = carRoutes?.data?.length
    ? carRoutes?.data?.find(
        (route) => route.status === RouteStatus.STATUS_ACTIVE
      )
    : null;
  const currentRouteId = currentRoute?.id;

  const plannedRoutes = carRoutes?.data?.filter(
    (route) => route.id !== currentRouteId
  );

  return (
    <MainTemplate>
      <div className="driver-page">
        <Panel bordered bodyFill shaded style={{ padding: "2rem" }}>
          {user ? (
            <h3>
              Водитель {user?.username} {currentCar?.number_plate}
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
                        equals: RouteStatus.STATUS_STARTED,
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
              </>
            ) : (
              <b>Нет активных рейсов</b>
            )}
          </div>
        </Panel>
      </div>
    </MainTemplate>
  );
};

export default Driver;
