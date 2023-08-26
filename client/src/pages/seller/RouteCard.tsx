import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { Button, List, Panel } from "rsuite";
import formatDate from "../../helpers/formatDate";
import driverCompleteRoute from "../../model/route/api/driverCompleteRoute";
import driverStartRoute from "../../model/route/api/driverStartRoute";
import { IRoute } from "../../model/route/IRoute";
import { IUser } from "../../model/user/user";
import { RouteStatus, RouteStatusLocalized } from "../../types/route";
import { UserRole } from "../../types/user";

interface RouteCardProps {
  route: IRoute;
  user: IUser;
  routeName: string;
}

const RouteCard: React.FC<RouteCardProps> = ({ user, route, routeName }) => {
  const queryClient = useQueryClient();

  const isDriver = user.role === UserRole.ROLE_EMPLOYEE_DRIVER;

  return (
    <Panel shaded header={routeName}>
      <List hover>
        {/* <p>
          Начальная точка: <b>{route?.start_spot_text}</b>
        </p> */}
        <p>
          Дата начала: <b>{formatDate(route.start_date)}</b>
        </p>
        <p>
          Номер авто: <b>{route.car.number_plate}</b>
        </p>
        <p>
          Добавить баллонов:{" "}
          <b>
            5л-{route.add_tanks5_capability}шт. 13л-
            {route.add_tanks13_capability}шт. 19л-
            {route.add_tanks19_capability}шт.
          </b>
        </p>
        <p>
          Итого добавить: <b>{route.add_capability}</b>
        </p>
        <p>
          Конечная точка: <b>{route?.end_spot?.address_name}</b>
        </p>
        <p>
          Дата добавления: <b>{route.created_at}</b>
        </p>
        <p>
          Статус: <b>{RouteStatusLocalized[route?.status]}</b>
        </p>
        {isDriver ? (
          <>
            {route?.status === RouteStatus.STATUS_ACTIVE ? (
              <Button
                appearance="primary"
                onClick={async () => {
                  await driverStartRoute(route.id);
                  toast.success("Рейс на выполнении", {
                    toastId: "ROUTE_COMPLETED",
                  });
                  await queryClient.invalidateQueries();
                }}
              >
                Начать
              </Button>
            ) : route.status === RouteStatus.STATUS_STARTED ? (
              <Button
                appearance="primary"
                onClick={async () => {
                  await driverCompleteRoute(route.id);
                  toast.success("Рейс завершен", {
                    toastId: "ROUTE_COMPLETED",
                  });
                  await queryClient.invalidateQueries();
                }}
              >
                Завершить
              </Button>
            ) : null}
          </>
        ) : null}
      </List>
    </Panel>
  );
};

export default RouteCard;
