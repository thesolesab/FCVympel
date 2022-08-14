import { initializeApp } from "firebase/app";
import {
    createUserWithEmailAndPassword,
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    sendEmailVerification,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile
} from "firebase/auth";
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, increment, onSnapshot, query, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";
import { getDownloadURL, getStorage, listAll, ref } from "firebase/storage";
import { useEffect, useState } from "react";

const app = initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
});

const auth = getAuth(app)

const db = getFirestore(app);

const storage = getStorage(app);

const provider = new GoogleAuthProvider();



export async function signup(user) {
    return await createUserWithEmailAndPassword(auth, user.email, user.password)
        .then(async response => {
            await updateProfile(response.user, {
                photoURL: user.avatar,
                displayName: user.name
            })
        })
}

export function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
}

export function logout() {
    return signOut(auth)
}

export function googleAuth() {
    return signInWithPopup(auth, provider)
}

export async function avatarFetch(setLoading) {
    const listRef = ref(storage, 'avatars/default')
    const list = []
    setLoading(true)
    const { items } = await listAll(listRef)

    for (const item of items) {
        await getDownloadURL(item).then(url => list.push(url))
    }
    console.log(list);
    return list
}



const actionCodeSettings = {
    url: 'http://localhost:3000/',
    handleCodeInApp: true,
};

export function verifyEmail() {
    const user = auth.currentUser
    return sendEmailVerification(user, actionCodeSettings)
}

//Custom Hook

export function useAuth() {
    const [loading, setLoading] = useState(false)
    const [currentUser, setCurrentUser] = useState()

    useEffect(() => {
        setLoading(true)
        const unsub = onAuthStateChanged(auth, user => {
            if (user) {
                const userRef = doc(db, "users", user.uid)
                onSnapshot(userRef, (doc) => {
                    if (doc.exists()) {
                        const data = doc.data()
                        setCurrentUser({ ...user, ...data })
                    } else {
                        setDoc(userRef, {
                            name: user.displayName,
                            games: 0,
                            goals: 0,
                            roles: ["user"],
                            id: user.uid,
                            avatar: user.photoURL,
                            totalWins: 0,
                            questioned: false
                        })
                    }
                })
            }
            setLoading(false)
        })
        return unsub
    }, [])

    return { currentUser, loading }
}

export function useAvatarImgs() {
    const [loading, setLoading] = useState(true)
    const [imgs, setImgs] = useState()
    const listRef = ref(storage, 'avatars/default')


    async function getData() {

        const avatarsRefs = []
        const urls = []

        const response = await listAll(listRef)
        response.items.forEach(itemRef => avatarsRefs.push(itemRef))

        if (avatarsRefs.length > 0) {
            for (let avatrRef of avatarsRefs) {
                const avatarUrl = await getDownloadURL(avatrRef)
                urls.push(avatarUrl)
            }
        }

        setImgs(urls)
        setLoading(false)
    }

    useEffect(() => {
        getData()
        // eslint-disable-next-line 
    }, [])


    return { imgs, loading }
}

//DB

export async function setPlayer(user) {
    const playerRef = doc(db, "games/players/children", user.name)
    const teamRef = doc(db, "games/teams/children/unsorted")

    return await setDoc(playerRef, {
        ...user,
        createdAt: Timestamp.fromDate(new Date()),
        team: 'unsorted'
    }).then(() => {
        updateDoc(teamRef, {
            total: increment(1)
        })
    })
}

export function setGameDay(game, next) {
    let route = ''
    if (next) {
        route = "games/gameDays/children/nextGame"
    } else {
        route = `games/gameDays/children/${game.name}`
    }
    const GameDayRef = doc(db, route)

    return setDoc(GameDayRef, {
        ...game
    })
}

export function setLastGame(game) {
    const GameDayRef = doc(db, "games/gameDays/children/lastGame")

    return setDoc(GameDayRef, {
        name: game.name
    })
}

export function updatePlayer([name, newTeam, oldTeam]) {
    const playerRef = doc(db, "games/players/children", name)
    const oldTeamRef = doc(db, `games/teams/children/${oldTeam}`)
    const newTeamRef = doc(db, `games/teams/children/${newTeam}`)

    return updateDoc(playerRef, { team: newTeam })
        .then(() => {
            updateDoc(newTeamRef, {
                total: increment(1)
            })
            if (oldTeam) {
                updateDoc(oldTeamRef, {
                    total: increment(-1)
                })
            }
        })
}

export async function updateUser(currentUser, games, { goals }) {
    if (currentUser.legioner) {
        return
    }

    const userRef = doc(db, "users", currentUser.id)

    if (goals) {
        await updateDoc(userRef, {
            goals: increment(goals),
        })
    }

    if (games) {
        await updateDoc(userRef, {
            games: increment(1)
        })
    }

}



export async function deletePlayer(name) {
    const playerRef = doc(db, "games/players/children", name)
    const docSnap = await getDoc(playerRef)
    const teamRef = doc(db, `games/teams/children/${docSnap.data().team}`)

    return deleteDoc(playerRef)
        .then((e) => {
            updateDoc(teamRef, {
                total: increment(-1)
            })
        })
}

export async function addTeam({ name }) {
    const teamRef = doc(db, "games/teams/children", name)

    return await setDoc(teamRef, { name, total: 0 })
}

export async function deleteTeam(name) {
    const teamRef = doc(db, "games/teams/children", name)
    const q = query(collection(db, "games/players/children"), where("team", "==", name))

    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
        const player = doc.data()
        updatePlayer([player.name, 'unsorted'])
    })

    return deleteDoc(teamRef)
}

export async function updateResults({ lap, num, ...res }) {
    const lastGameNameRef = doc(db, `games/gameDays/children/lastGame`)
    const lastGameName = await getDoc(lastGameNameRef)
        .then(doc => doc.data())
    const lastGameRef = doc(db, `games/gameDays/children/${lastGameName.name}`)

    let path = `results.${lap}`

    if (num < 1000) {
        path = `results.${--lap}.${num}`
    }

    updateDoc(lastGameRef, {
        [path]: { ...res }
    })
}



export async function questionedPlayer(idx) {
    const lastGameNameRef = doc(db, `games/gameDays/children/lastGame`)
    const lastGameName = await getDoc(lastGameNameRef)
        .then(doc => doc.data())
    const lastGameRef = doc(db, `games/gameDays/children/${lastGameName.name}`)

    const path = `players.${idx}.questioned`

    updateDoc(lastGameRef, {
        [path]: true
    })

}

//Custom Hook DB

export function useLastGame() {
    const [game, setGame] = useState()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getRef = async () => {
            const lastGameRef = doc(db, `games/gameDays/children/lastGame`)
            const lastGameName = await getDoc(lastGameRef)
                .then(doc => doc.data())
            const lastGamePlayersRef = doc(db, `games/gameDays/children/${lastGameName.name}`)
            onSnapshot(lastGamePlayersRef, doc => {
                setGame(doc.data())
                setLoading(false)
            })
        }
        getRef()
    }, [])

    return [game, loading]
}

export function useUserFromDb(id) {
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        const userRef = doc(db, "users", id)

        const unsub = onSnapshot(userRef, snap => {
            setUser(snap.data())
            setLoading(false)
        })

        return unsub
    }, [id])

    return [user, loading]
}

export function useFetchData(path) {
    const [docs, setDocs] = useState()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        const docsRef = collection(db, path)

        const unsub = onSnapshot(docsRef, snap => {
            let items = []
            snap.forEach(doc => {
                items.push(doc.data())
            })
            setDocs(items)
            setLoading(false)
        })

        return unsub
    }, [path])

    return [docs, loading]
}



export { auth, db, storage }