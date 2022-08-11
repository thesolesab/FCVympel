import { Box } from '@mui/material'
import Tab from '@mui/material/Tab';
import { useState } from 'react';
import TabPanel from '@mui/lab/TabPanel';
import TabList from '@mui/lab/TabList';
import TabContext from '@mui/lab/TabContext';
import AdminTeams from 'components/AdminTeams';
import { useLocation } from 'react-router-dom';


function AdminPage() {
    let location = useLocation()

    const [value, setValue] = useState(location.hash || '#team');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    }

    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} centered>
                        <Tab label="Создать команды" value="#team" />
                        <Tab label="Заполнить результаты" value="#results" />
                        <Tab label="Добавить новость" value="#news" />
                        <Tab label="Загрузить фото" value="#photo" />
                    </TabList>
                </Box>
                <TabPanel value="#team">
                    <AdminTeams />
                </TabPanel>
                <TabPanel value="#results">Результаты</TabPanel>
                <TabPanel value="#news">News</TabPanel>
                <TabPanel value="#photo">Photo</TabPanel>
            </TabContext>
        </Box>
    )
}

export default AdminPage