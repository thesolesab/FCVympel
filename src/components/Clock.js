import { useEffect, useState } from 'react';

function Clock() {
    const [date, setDate] = useState()

    useEffect(() => {
        const interval = setInterval(() => {
            setDate(new Intl.DateTimeFormat('ru-RU', {
                // day: '2-digit',
                weekday: 'short',
                // month: 'long',
                // year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                // second: 'numeric'
            }).format(new Date()).toUpperCase())
        }, 1000)

        return () => clearInterval(interval)
    }, [date])

    return (
        <>{date}</>
    )
}

export default Clock

