import { useNavigate } from "react-router-dom";
import { Nav } from "rsuite";
// import HomeIcon from '@rsuite/icons/H'

const Navbar = ({ activeNav }) => {
  const navigate = useNavigate();
  return (
    <Nav appearance="subtle" justified>
      <Nav.Item active={activeNav === null} onSelect={() => navigate("/")}>
        Главная
      </Nav.Item>
      <Nav.Item
        active={activeNav === "routes"}
        onSelect={() => navigate("/?nav=routes")}
      >
        Рейсы
      </Nav.Item>
      <Nav.Item
        active={activeNav === "users"}
        onSelect={() => navigate("/?nav=users")}
      >
        Сотрудники
      </Nav.Item>
      <Nav.Item
        active={activeNav === "spots"}
        onSelect={() => navigate("/?nav=spots")}
      >
        Точки
      </Nav.Item>
      <Nav.Item
        active={activeNav === "cars"}
        onSelect={() => navigate("/?nav=cars")}
      >
        Автомобили
      </Nav.Item>
      <Nav.Item>Отчет</Nav.Item>
    </Nav>
  );
};

export default Navbar;
