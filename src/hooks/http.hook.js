import { logout } from "firebase1";
import { useDispatch } from "react-redux";
import { userLogout } from "store/slices/userSlice";
import { useNavigate } from "react-router-dom";

export const useHttp = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await logout()
            await dispatch(userLogout())
            navigate('/')
        } catch (e) {
            console.log(e);
        }
    }

    function declensionNum(num, words) {
        return words[(num % 100 > 4 && num % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(num % 10 < 5) ? num % 10 : 5]];
    }

    const timeToGame = (nextGameDate) => {

        const today = new Date()
        const delta = nextGameDate - today
        let text = 'null'

        if (Math.floor(delta / 1000 / 60 / 60 / 24) > 0) {
            const days = delta > 0 ? Math.floor(delta / 1000 / 60 / 60 / 24) : 0
            const hours = delta > 0 ? Math.floor(delta / 1000 / 60 / 60) % 24 : 0
            text = `${declensionNum(days, ['остался', 'осталось', 'осталось'])} ${days} ${declensionNum(days, ['день', 'дня', 'дней'])}, ${hours} ${declensionNum(hours, ['час', 'часа', 'часов'])}`
        } else if (Math.floor(delta / 1000 / 60 / 60) > 0) {
            const hours = delta > 0 ? Math.floor(delta / 1000 / 60 / 60) % 24 : 0;
            const minutes = delta > 0 ? Math.floor(delta / 1000 / 60) % 60 : 0;
            text = `${declensionNum(hours, ['остался', 'осталось', 'осталось'])} ${hours} ${declensionNum(hours, ['час', 'часа', 'часов'])}, ${minutes} ${declensionNum(minutes, ['минута', 'минуты', 'минут'])}`
        } else {
            const minutes = Math.floor(delta / 1000 / 60)
            text = `${minutes} ${declensionNum(minutes, ['минута', 'минуты', 'минут'])}`
        }

        return text
    }


    return { handleLogout, timeToGame }
}

