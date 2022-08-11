import React from 'react'

function AuthError({ msg }) {

    let errorStr = ''

    console.log(msg);

    switch (msg) {
        case 'auth/user-not-found':
            errorStr = 'Такого пользователя не существует'
            break
        case 'auth/wrong-password':
            errorStr = 'Неверный пароль'
            break
        case 'auth/too-many-requests':
            errorStr = 'Слишком много запросов, попробуйте позже'
            break
        case 'auth/email-already-in-use':
            errorStr = 'Такой Email уже существует'
            break
        default:
            errorStr = msg
            break
    }

    return (
        <div className="error">
            <p>
                Упс...
            </p>
            <p>
                {errorStr}
            </p>
        </div>
    )

}

export default AuthError