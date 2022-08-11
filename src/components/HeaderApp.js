import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import useUserFromStore from 'hooks/useUserFromStore'
import { ButtonGroup, Divider, Link, ListItemIcon, Stack, Zoom } from '@mui/material'
import { LoginOutlined, Logout } from '@mui/icons-material'
import { Link as RouterLink, useLocation, } from 'react-router-dom'
import { useMemo, useState } from 'react'
import Login from './Login'
import { useHttp } from 'hooks/http.hook'


const generalPages = [
    { name: "Главная", link: "/" },
    { name: "Команды", link: "/teams" },
    { name: "Результаты", link: "/results" },

]

const privatePages = [
    { name: "Чат", link: "/chat" },
    { name: "Фото", link: "/photo" }
]

const adminPages = [
    { name: "Админка", link: "/admin" }
]
// const settings = ['Профиль', 'Выход']



const HeaderApp = () => {
    const [anchorElNav, setAnchorElNav] = useState(null)
    const [anchorElUser, setAnchorElUser] = useState(null)
    const [openDialog, setOpenDialog] = useState(false);
    const { avatar, name, isAuth, roles } = useUserFromStore()
    const { pathname } = useLocation()

    const handleClickOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget)
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget)
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null)
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null)
    };

    const { handleLogout } = useHttp()

    const pages = useMemo(() => {
        let pages = [...generalPages]

        if (isAuth) {
            pages = [...pages, ...privatePages]
        }
        if (roles?.includes("admin")) {
            pages = [...pages, ...adminPages]
        }
        return pages
    }, [isAuth, roles])

    return (
        <>
            <AppBar position='sticky' >
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                mr: 2,
                                fontWeight: "bold",
                                display: { xs: 'none', md: 'flex' }
                            }}
                        >
                            FCV
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: 'block', md: 'none' },
                                }}
                            >
                                {pages.map(page => (
                                    <MenuItem key={page.name} onClick={handleCloseNavMenu} >
                                        <Link
                                            textAlign="center"
                                            underline="none"
                                            color="black"
                                            component={RouterLink}
                                            to={page.link}
                                        >
                                            {page.name}
                                        </Link>
                                    </MenuItem>
                                ))}

                            </Menu>
                        </Box>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
                        >
                            FC Vympel
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            <ButtonGroup variant="text" aria-label="text button group">
                                {pages.map((page) => (
                                    <Button
                                        variant={pathname === page.link ? "contained" : "text"}
                                        key={page.name}
                                        component={RouterLink}
                                        onClick={handleCloseNavMenu}
                                        to={page.link}
                                        sx={{ my: 2, color: 'black', display: 'block' }}
                                    >
                                        {page.name}
                                    </Button>
                                ))}
                            </ButtonGroup>
                        </Box>

                        <Stack direction="row" spacing={2}>
                            {!isAuth &&
                                <>
                                    <Button
                                        color='success'
                                        sx={{
                                            cursor: 'pointer',
                                            minWidth: 70,
                                            display: { xs: 'none', md: 'flex' },
                                            fontWeight: "bold",
                                            fontSize: 25
                                        }}
                                        onClick={handleClickOpenDialog}
                                    >
                                        Вход
                                    </Button>
                                    <Button
                                        component={RouterLink}
                                        color='error'
                                        sx={{
                                            cursor: 'pointer',
                                            minWidth: 70,
                                            display: { xs: 'none', md: 'flex' },
                                            fontWeight: "bold",
                                            fontSize: 25
                                        }}
                                        to={"/registration"}
                                    >
                                        Регистрация
                                    </Button>
                                    <LoginOutlined sx={{ minWidth: 70, display: { xs: 'flex', md: 'none' } }} onClick={handleClickOpenDialog} />
                                </>
                            }

                            {isAuth &&
                                <>
                                    <Tooltip
                                        arrow={true}
                                        TransitionComponent={Zoom}
                                        title="Открыть настройки"
                                    >
                                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                            <Avatar
                                                alt={name || 'user'}
                                                variant="rounded"
                                                imgProps={{
                                                    sx: {
                                                        objectFit: 'contain',
                                                    }
                                                }}
                                                src={avatar}
                                            />
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        anchorEl={anchorElUser}
                                        id="menu-appbar"
                                        open={Boolean(anchorElUser)}
                                        onClose={handleCloseUserMenu}
                                        onClick={handleCloseUserMenu}
                                        PaperProps={{
                                            elevation: 0,
                                            sx: {
                                                overflow: 'visible',
                                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                                mt: 1.5,
                                                '& .MuiAvatar-root': {
                                                    width: 32,
                                                    height: 32,
                                                    ml: -0.5,
                                                    mr: 1,
                                                },
                                                '&:before': {
                                                    content: '""',
                                                    display: 'block',
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 14,
                                                    width: 10,
                                                    height: 10,
                                                    bgcolor: 'background.paper',
                                                    transform: 'translateY(-50%) rotate(45deg)',
                                                    zIndex: 0,
                                                },
                                            },
                                        }}
                                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                    >
                                        <MenuItem>
                                            <Link
                                                component={RouterLink}
                                                sx={{
                                                    display: "flex",
                                                    mr: "2rem",
                                                    fontSize: "21.5px",
                                                    color: "black"
                                                }}
                                                underline="none"
                                                to={`users/me`}
                                            >
                                                <Avatar
                                                    alt={name || 'user'}
                                                    variant="rounded"
                                                    imgProps={{
                                                        sx: {
                                                            objectFit: 'contain',
                                                        }
                                                    }}
                                                    src={avatar}
                                                />
                                                Профиль
                                            </Link>
                                        </MenuItem>
                                        <Divider />
                                        <MenuItem onClick={handleLogout}
                                            sx={{
                                                fontSize: "21.5px",
                                                color: "black"
                                            }}
                                        >
                                            <ListItemIcon>
                                                <Logout fontSize="small" />
                                            </ListItemIcon>
                                            Выход
                                        </MenuItem>
                                    </Menu>
                                </>
                            }
                        </Stack>
                    </Toolbar>
                </Container>
            </AppBar >
            {!isAuth && openDialog && <Login handleCloseDialog={handleCloseDialog} openDialog={openDialog} />}
        </>
    )
}

export default HeaderApp