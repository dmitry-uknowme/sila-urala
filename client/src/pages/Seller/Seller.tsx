import { useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { Button, List, Loader, Nav, Panel, SelectPicker } from "rsuite";
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
import getSpots from "../../model/spot/api/getSpots";
import Table from "../../table";
import updateSpot from "../../model/spot/api/updateSpot";
import getUser from "../../model/user/api/getUser";
import updateUser from "../../model/user/api/updateUser";
import EditIcon from "@rsuite/icons/Edit";

const Seller = () => {
  const { auth } = useContext(AuthContext);
  const [activeNav, setActiveNav] = useState<"active" | "completed" | "cars">(
    "active"
  );
  const queryClient = useQueryClient();
  const user = auth?.session?.user!;
  const userId = user?.id;

  const seller = useQuery(
    ["seller", userId],
    async () => await getUser(userId),
    { enabled: !!userId }
  );

  const currentSpot = seller?.data?.spot;
  const currentSpotId = currentSpot?.id;

  const activeRoutes = useQuery(
    ["activeRoutes"],
    async () =>
      await getRoutes({
        end_spot_id: currentSpotId,
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
    { enabled: !!currentSpotId }
  );

  const completedRoutes = useQuery(
    ["completedRoutes"],
    async () =>
      await getRoutes({
        end_spot_id: currentSpotId,
        OR: [
          {
            status: {
              equals: RouteStatus.STATUS_COMPLETED,
            },
          },
        ],
      }),
    { enabled: !!currentSpotId }
  );

  const { data: spotsData } = useQuery(["spots"], async () => await getSpots());

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

  const [actionType, setActionType] = useState(null);
  const [formValue, setFormValue] = useState(currentSpot);
  const [sellerFormValue, setSellerFormValue] = useState(seller?.data);
  const [sellerFormType, setSellerFormType] = useState(null);

  useEffect(() => {
    if (actionType !== "UPDATE") {
      setFormValue(currentSpot);
    }
  }, [currentSpot, actionType]);

  useEffect(() => {
    if (sellerFormType !== "UPDATE") {
      console.log("selllerr", seller);
      setSellerFormValue(seller?.data);
    }
  }, [userId, sellerFormType]);

  return (
    <MainTemplate>
      <div className="driver-page">
        {sellerFormType === "UPDATE" ? (
          <Table
            actionType={sellerFormType}
            setActionType={setSellerFormType}
            form={{
              update: {
                title: "Сменить точку",
                onSubmit: async (data) => {
                  const sellerId = userId;
                  const response = await updateUser(sellerId, {
                    spot_id: data.spot_id,
                  });
                  await queryClient.invalidateQueries(["seller"]);
                  return response;
                },
              },
              fields: [
                {
                  name: "car_id",
                  label: "Выберите точку",
                  accepter: SelectPicker,
                  options: spotsData?.map((spot) => ({
                    label: spot.address_name,
                    value: spot.id,
                  })),
                },
              ],
            }}
            formValue={sellerFormValue}
            setFormValue={setSellerFormValue}
          />
        ) : null}

        {actionType === "UPDATE" ? (
          <Table
            actionType={actionType}
            setActionType={setActionType}
            form={{
              update: {
                title: "Редактирование точки",
                onSubmit: async (data) => {
                  const carId = currentSpot.id;
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
              fields: [
                { name: "address_name", label: "Адрес" },
                { name: "max_capability", label: "Макс. вместимость" },
                {
                  name: "tanks5_capability",
                  label: "Кол-во баллонов 5л (шт.)",
                },
                {
                  name: "tanks13_capability",
                  label: "Кол-во баллонов 13л (шт.)",
                },
                {
                  name: "tanks19_capability",
                  label: "Кол-во баллонов 19л (шт.)",
                },
                { name: "capability", label: "Текущая вместимость (л)" },
                // { name: "coordinates", label: "Координаты" },
              ],
            }}
            formValue={formValue}
            setFormValue={setFormValue}
          />
        ) : null}
        <Panel bordered bodyFill shaded style={{ padding: "2rem" }}>
          {user ? (
            <>
              <h3>
                Продавец {user?.username}{" "}
                <span onClick={() => setSellerFormType("UPDATE")}>
                  {currentSpot?.address_name}{" "}
                  <EditIcon style={{ fontSize: "1.3rem" }} />
                </span>
              </h3>
            </>
          ) : null}

          <Nav appearance="subtle" justified>
            <Nav.Item
              active={activeNav === "current"}
              onSelect={(key) => {
                setFilter({
                  end_spot: { id: currentSpotId },
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
              Запланированные рейсы ({activeRoutes?.data?.length})
            </Nav.Item>
            <Nav.Item
              active={activeNav === "completed"}
              onSelect={(key) => {
                setFilter({
                  end_spot: { id: currentSpotId },
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
            <Nav.Item>Точки</Nav.Item>
          </Nav>
          <h4 className="rs-panel-header d-flex align-items-center py-0 mt-4">
            <div className="rs-panel-title">Информация о точке</div>
            &nbsp;&nbsp;
            <Button
              appearance="primary"
              size="sm"
              onClick={() => setActionType("UPDATE")}
            >
              Редактировать
            </Button>
          </h4>
          <Panel style={{ padding: "0" }}>
            {currentSpot ? (
              <div className="">
                <p>
                  Макс. вместимость (л): <b>{currentSpot.max_capability}</b>
                </p>
                <p>
                  Текущая вместимость (л): 5л-{currentSpot.tanks5_capability}шт.
                  13л-
                  {currentSpot.tanks13_capability}шт. 19л-
                  {currentSpot.tanks19_capability}шт. ({currentSpot.capability})
                </p>
                <p>Заполнено за сегодня (л): {currentSpot.capability}</p>
              </div>
            ) : (
              <Loader center />
            )}
          </Panel>
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

export default Seller;
