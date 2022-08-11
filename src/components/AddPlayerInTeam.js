import { Autocomplete, Checkbox, TextField } from '@mui/material'

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useState } from 'react';
import { updatePlayer } from 'firebase1';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function AddPlayerInTeam({ players, team }) {
    const [value, setValue] = useState([]);

    function handleClose() {
        value?.map(async (player) => {
            setValue([])
            await updatePlayer([player.name, team, player.team])
        })
    }

    return (
        <Autocomplete
            value={value}
            multiple
            size="small"
            sx={{
                mt: 1
            }}
            options={players?.filter(el => el.team !== team).sort((a, b) => a.team > b.team ? 1 : -1)}
            onChange={(e, newValue) => {
                setValue(newValue)
            }}
            onClose={() => {
                handleClose()
            }}
            disableCloseOnSelect
            getOptionLabel={(option) => option.name}
            renderOption={(props, option, { selected }) => (
                <li
                    {...props}
                    style={{
                        backgroundColor: `${option.team !== "unsorted" ? '#b5df5589' : null}`,
                        border: `${option.team !== "unsorted" ? '1px solid' : null}`
                    }}
                >
                    <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                    />
                    {option.name}
                </li >
            )
            }
            renderInput={(params) => (
                <TextField {...params} label="Игроки" placeholder="Кого добавим?" />
            )}
        />
    )
}

export default AddPlayerInTeam