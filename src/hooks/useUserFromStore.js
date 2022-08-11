import { useSelector } from 'react-redux';
import { selectUser } from 'store/slices/userSlice';


function useUserFromStore() {
    const pervUser = useSelector(selectUser)
    const user = { ...pervUser[0] }

    user.isAuth = !!user.id

    user.isAdmin = user?.roles?.includes("admin")

    return user
}

export default useUserFromStore