import { useQueryClient } from "react-query";
import { Button, List, Panel } from "rsuite";
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
        {/* <List.Item>
          Начальная точка: <b>{route?.start_spot_text}</b>
        </List.Item> */}
        <List.Item>
          Дата начала: <b>{route.start_date}</b>
        </List.Item>
        <List.Item>
          Конечная точка: <b>{route?.end_spot?.address_name}</b>
        </List.Item>
        <List.Item>
          Дата добавления: <b>{route.created_at}</b>
        </List.Item>
        <List.Item>
          Статус: <b>{RouteStatusLocalized[route?.status]}</b>
        </List.Item>
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
