import axios from "axios"

const getCars = async () => {
    const { data } = await axios.get('http://localhost:3000/api/cars')
    return data
}

export default getCars