const Routes = () => {
    const generalPages = [
        { name: "Главная", link: "/" },
        { name: "Команды", link: "/teams" },
    ]

    const privatePages = [
        { name: "Чат", link: "/chat" },
        { name: "Фото", link: "/photo" }
    ]

    const adminPages = [
        { name: "Админка", link: "/admin" }
    ]

    return { generalPages, privatePages, adminPages }
}

export default Routes