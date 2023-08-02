import { Nav } from "rsuite"
// import HomeIcon from '@rsuite/icons/H'

const Navbar = () => {
    return (
        <Nav appearance="subtle" justified>
            <Nav.Item active /* icon={<HomeIcon />} */>
                Главная
            </Nav.Item>
            <Nav.Item>Рейсы</Nav.Item>
            <Nav.Item>Сотрудники</Nav.Item>
            <Nav.Item>Точки</Nav.Item>
            <Nav.Item>Автомобили</Nav.Item>
            <Nav.Item>Отчет</Nav.Item>
        </Nav>
    )
}

export default Navbar