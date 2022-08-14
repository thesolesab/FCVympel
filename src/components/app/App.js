import { Route, Routes } from 'react-router-dom';
import HomePage from 'pages/HomePage';
import UserPage from 'pages/UserPage';
import ProfilePage from 'pages/ProfilePage';
import LoadingToRedirect from 'components/loadingToRedirect/LoadingToRedirect';
import ChatPage from 'pages/ChatPage';
import { useAuth, useFetchData } from 'firebase1';
import TeamsPage from 'pages/TeamsPage';
import HeaderApp from 'components/HeaderApp';
import { Container, LinearProgress } from '@mui/material';
import RegistrationPage from 'pages/RegistrationPage';
import AdminPage from 'pages/AdminPage';
import useUserFromStore from 'hooks/useUserFromStore';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { userLogin } from 'store/slices/userSlice';
import { setNextGame } from 'store/slices/gameSlice';

import DialogOnOpen from 'components/DialogOnOpen';
import ResultsPage from 'pages/ResultsPage';
import useSetLastGameInDB from 'hooks/useSetLastGameInDB';




function App() {
  const dispatch = useDispatch()
  const { currentUser, loading } = useAuth()
  const { isAuth, isAdmin } = useUserFromStore()
  const [games] = useFetchData('games/gameDays/children')
  const nextGame = games?.find(el => el.name === 'NextGame')

  useSetLastGameInDB()

  useEffect(() => {
    if (nextGame) {
      dispatch(setNextGame({
        ...nextGame,
        date: nextGame.date.seconds
      }))
    }
  }, [dispatch, nextGame])

  function ucFirst(str) {
    if (!str) return str;
    return str[0].toUpperCase() + str.slice(1);
  }

  useEffect(() => {
    if (currentUser) {
      dispatch(userLogin({
        name: ucFirst(currentUser.displayName),
        id: currentUser.uid,
        avatar: currentUser.photoURL,
        email: currentUser.email,
        emailVerified: currentUser.emailVerified,
        roles: currentUser.roles,
        games: currentUser.games,
        goals: currentUser.goals,
        totalWins: currentUser.totalWins,
        questioned: currentUser.questioned
      }))
    }
  }, [currentUser, dispatch])


  return (
    <>
      <HeaderApp />
      {loading && <LinearProgress color="secondary" />}
      {/* <DialogOnOpen /> */}
      <Container maxWidth="xl">
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='registration' element={
            !isAuth ?
              <RegistrationPage />
              :
              <LoadingToRedirect errorMsg={'Вы уже зарегестрировались'} route={'/'} />
          } />
          <Route path='teams' element={<TeamsPage />} />
          <Route path='results' element={<ResultsPage />} />


          {/* Приватные пути */}
          {isAuth &&
            <>
              <Route path='users/me' element={<ProfilePage />} />
              <Route path='chat' element={<ChatPage />} />
              <Route path='users/:userId' element={<UserPage />} />
            </>
          }

          {/* Админ пути */}


          <Route path='admin' element={isAdmin ? <AdminPage /> : <LoadingToRedirect errorMsg={'Хорошая попытка...'} route={-1} />} />


          {/* заглушка */}
          <Route path='*' element={<LoadingToRedirect errorMsg={'Упсс...Такой страницы не сущществует'} route={-1} />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
