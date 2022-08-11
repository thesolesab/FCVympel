import { CircularProgress, ToggleButton } from '@mui/material'
import { useAvatarImgs } from 'firebase1'
import { Field } from 'formik'
import { ToggleButtonGroup } from 'formik-mui'

function AvatarsList() {
    const { imgs, loading } = useAvatarImgs()

    return (
        <>
            {loading ?
                <CircularProgress color="inherit" />
                :
                <Field
                    component={ToggleButtonGroup}
                    name="avatar"
                    type="checkbox"
                    exclusive
                    style={{
                        marginTop: '10px'
                    }}
                >
                    {imgs?.map((item, i) => (
                        <ToggleButton
                            key={i}
                            value={item}
                            // sx={{
                            //     width: "70px",
                            //     height: "70px"
                            // }}
                            color="success"
                        >
                            <img
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'fill',
                                }}
                                src={item}
                                alt={`avatar ${i}`}
                                loading="lazy"
                            />
                        </ToggleButton>
                    ))}
                </Field>

            }
        </>
    )
}

export default AvatarsList