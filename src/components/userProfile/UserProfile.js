import { db } from '../../firebase1';
import { getAuth, updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
// import { updateUserName } from 'store/slices/userSlice';
import './userProfile.scss'
import { defaultAvatar } from 'constants';

function UserProfile() {


    const dispatch = useDispatch()
    // const photoURL = user.photoURL;
    const emailVerified = false;

    const { name, email, photoURL, id } = useSelector((state) => state.user)

    const [newName, setNewName] = useState(name)
    const [newEmail, setNewEmail] = useState(email)

    const userRef = doc(db, "users", id)

    // const updateName = (newName) => {
    //     const auth = getAuth()
    //     const user = auth.currentUser

    //     if (newName.length === 0 || newName === name) {
    //         return
    //     }
    //     console.log('update');
    //     updateProfile(user, {
    //         displayName: newName
    //     })
    //         .then(() => {
    //             updateDoc(userRef, {
    //                 name: newName
    //             })
    //         })
    //         .then(() => {
    //             console.log('dispatch');
    //             dispatch(updateUserName({
    //                 name: user.displayName
    //             }))
    //         })
    //         .catch(console.error)
    // }

    return (
        <div className="container">
            <div className="profile">
                <div className="profile__card">
                    <div className="profile__data">
                        <p >Имя:
                            <input
                                placeholder='Введите имя'
                                name='name'
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                // onBlur={() => updateName(newName)}
                                type="text"
                            />
                        </p>
                        <p>Email:
                            <input
                                type="email"
                                readOnly
                                placeholder='Введите email'
                                value={newEmail}
                            />
                        </p>

                        <p
                            onClick={null}
                            style={emailVerified
                                ? { color: 'green' }
                                : { color: 'red' }
                            }
                        >
                            {emailVerified
                                ? "Ваш Email адрес подтвержден"
                                : "Подтвердите Email"
                            }
                        </p>
                    </div>

                    <img
                        className='profile__image'
                        src={photoURL ? photoURL : defaultAvatar}
                        alt="avatar"
                    />
                </div>
            </div>
        </div>
    )
}

export default UserProfile