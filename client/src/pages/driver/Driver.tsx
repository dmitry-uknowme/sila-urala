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

const Driver = () => {
  const { auth } = useContext(AuthContext);

  const queryClient = useQueryClient();
  const user = auth?.session?.user;
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

  const currentRoute = carRoutes?.data?.length ? carRoutes?.data[0] : null;
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
            <Nav.Item active>Текущий рейс</Nav.Item>
            <Nav.Item>Завершенные рейсы</Nav.Item>
            <Nav.Item>Автомобили</Nav.Item>
          </Nav>
          {currentRoute ? (
            <div className="mt-3">
              <Panel shaded header={"Рейс №1"}>
                <List hover>
                  <List.Item>
                    Начальная точка: <b>{currentRoute?.start_spot_text}</b>
                  </List.Item>
                  <List.Item>
                    Конечная точка:{" "}
                    <b>{currentRoute?.end_spot?.address_name}</b>
                  </List.Item>
                  <List.Item>
                    Дата добавления: <b>{currentRoute?.created_at}</b>
                  </List.Item>
                  <List.Item>
                    Статус: <b>{RouteStatusLocalized[currentRoute?.status]}</b>
                  </List.Item>
                  {currentRoute?.status === RouteStatus.STATUS_ACTIVE ? (
                    <Button
                      appearance="primary"
                      onClick={async () => {
                        await driverStartRoute(currentRoute.id);
                        toast.success("Рейс на выполнении", {
                          toastId: "ROUTE_COMPLETED",
                        });
                        await queryClient.invalidateQueries();
                      }}
                    >
                      Начать
                    </Button>
                  ) : currentRoute.status === RouteStatus.STATUS_STARTED ? (
                    <Button
                      appearance="primary"
                      onClick={async () => {
                        await driverCompleteRoute(currentRoute.id);
                        toast.success("Рейс завершен", {
                          toastId: "ROUTE_COMPLETED",
                        });
                        await queryClient.invalidateQueries();
                      }}
                    >
                      Завершить
                    </Button>
                  ) : null}
                </List>
              </Panel>
            </div>
          ) : (
            <b>Нет активных рейсов</b>
          )}
        </Panel>
      </div>
    </MainTemplate>
  );
};

export default Driver;
