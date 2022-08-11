import { useState } from 'react';
import { useUpdateProfile } from 'react-firebase-hooks/auth';

const UpdateProfile = () => {
    const auth = getAuth(firebaseApp);
    const [displayName, setDisplayName] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [updateProfile, updating, error] = useUpdateProfile(auth);

    if (error) {
        return (
            <div>
                <p>Error: {error.message}</p>
            </div>
        );
    }
    if (updating) {
        return <p>Updating...</p>;
    }
    return (
        <div className="App">
            <input
                type="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
            />
            <input
                type="photoURL"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
            />
            <button
                onClick={async () => {
                    await updateProfile({ displayName, photoURL });
                    alert('Updated profile');
                }}
            >
                Update profile
            </button>
        </div>
    );
};

export default UpdateProfile