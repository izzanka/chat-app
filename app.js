import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { initializeApp } from "firebase/app"
import { deleteDoc, getFirestore, collection, addDoc, query, where, getDocs, doc, limit, getDoc, updateDoc, QuerySnapshot } from "firebase/firestore"

const firebaseConfig = {
  
}

const app = express()
const port = 3000
const fb = initializeApp(firebaseConfig);
const db = getFirestore(fb)

app.use(cors({origin: '*'}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.send('Running...')
})

//register
app.post('/api/register', async(req, res) => {

    try {

        let fullname = req.body.fullname
        let username = req.body.username
        let password = req.body.password

        if(!fullname || !username || !password)
        {
            return res.status(401).json({
                success: false,
                message: "All field is required."
            })
        }

        const usersRef = collection(db, "users")
        const q = query(usersRef, where("username", "==", username))
        const querySnapshot = await getDocs(q)

        if(!querySnapshot.empty)
        {
            return res.status(403).json({
                success: false,
                message: "Username already registered.",
            })
        }

        const docRef = await addDoc(usersRef, {
            fullname: fullname,
            username: username,
            password: password,
        })

        return res.status(200).json({
            success: true,
            message: "Register success.",
            data: {
                id: docRef.id,
                fullname: fullname,
                username: username,
            }
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        })

    }
})

//login
app.post('/api/login', async(req,res) => {

    try {

        let username = req.body.username
        let password = req.body.password

        if(!username || !password)
        {
            return res.status(401).json({
                success: false,
                message: "All field is required."
            })
        }

        const usersRef = collection(db, "users")
        const q = query(usersRef, where("username", "==", username), limit(1))
        const querySnapshot = await getDocs(q)

        if(querySnapshot.empty)
        {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            })
        }

        querySnapshot.forEach((doc) => {

            if(password != doc.data().password)
            {
                return res.status(401).json({
                    success: false,
                    message: "Username or password is wrong."
                })
            }

            return res.status(200).json({
                success: true,
                message: "Login success.",
                data: {
                    id: doc.id,
                    fullname: doc.data().fullname,
                    username: doc.data().username,
                }
            })
            
        })
        
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        })

    }
})

//get user by id
app.post('/api/user', async(req,res) => {

    try {

        let user_id = req.body.user_id

        if(!user_id)
        {
            return res.status(401).json({
                success: false,
                message: "User id is required."
            })
        }

        const usersRef = doc(db, "users", user_id)
        const docUser = await getDoc(usersRef)
        const querySnapshot = await getDocs(collection(db, "users", user_id, "friends"))
        
        let friends = []

        querySnapshot.forEach((doc) => {
            friends.push({
                ...doc.data()
            })
        })

        if(docUser.empty)
        {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Get user data by id success.",
            data: {
                id: docUser.id,
                fullname: docUser.data().fullname,
                username: docUser.data().username,
                friends: friends
            }
        })
        
    } catch (error) {
        
        return res.status(500).json({
            success: false,
            message: error.message,
        })

    }

})

//edit user
app.put('/api/user', async(req,res) => {

    try {

        let user_id = req.body.user_id
        let fullname = req.body.fullname
        let username = req.body.username

        if(!user_id || !fullname || !username)
        {
            return res.status(401).json({
                success: false,
                message: "All field is required."
            })
        }

        const usersRef = collection(db, "users")
        const q = query(usersRef, where("username", "==", username))
        const querySnapshot = await getDocs(q)

        if(!querySnapshot.empty)
        {
            return res.status(403).json({
                success: false,
                message: "Username already registered.",
            })
        }

        const userRef = doc(db, "users", user_id)

        if(userRef.empty)
        {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            })
        }

        await updateDoc(userRef, {
            fullname: fullname,
            username: username
        })

        return res.status(200).json({
            success: true,
            message: "Update user success.",
        })
        
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        })

    }
})

//get all users
app.post('/api/users', async(req,res) => {

    try {

        let username = req.body.username

        if(!username)
        {
            return res.status(401).json({
                success: false,
                message: "Username is required."
            })
        }
        
        const usersRef = collection(db, "users")
        const q = query(usersRef, where("username", "!=", username))
        const querySnapshot = await getDocs(q)

        let users = []

        querySnapshot.forEach((doc) => {
            users.push({
                id: doc.id,
                fullname: doc.data().fullname,
                username: doc.data().username
            })
        })

        return res.status(200).json({
            success: true,
            message: "Get all users success.",
            data: users
        })

        
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }

})

//get req friends
app.post('/api/user/friends/req', async(req,res) => {

    try {

        let user_id = req.body.user_id

        if(!user_id)
        {
            return res.status(401).json({
                success: false,
                message: "User id is required."
            })
        }
        
        const querySnapshot = await getDocs(collection(db, "users", user_id, "friend_requests"))

        let friends_req = []

        querySnapshot.forEach((doc) => {
            friends_req.push({
                id: doc.id,
                fullname: doc.data().fullname,
                username: doc.data().username,
                user_id: doc.data().user_id
            })
        })

        return res.status(200).json({
            success: true,
            message: "Get friend requests success.",
            data: friends_req
        })
        
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }

})

//add friend
app.post('/api/user/friends/add', async(req,res) => {

    try {

        let user_id = req.body.user_id
        let friend_id = req.body.friend_id
        let user_fullname = req.body.user_fullname
        let user_username = req.body.user_username

        if(!user_id || !friend_id || !user_fullname || !user_username)
        {
            return res.status(401).json({
                success: false,
                message: "All field is required."
            })
        }

        await addDoc(collection(db, "users", friend_id, "friend_requests"),{
            user_id: user_id,
            fullname: user_fullname,
            username: user_username
        })

        return res.status(200).json({
            success: true,
            message: "Add friend success.",
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }

})

//acc friend
app.post('/api/user/friends/acc', async(req,res) => {

    try {

        let user_id = req.body.user_id
        let user_fullname = req.body.user_fullname
        let user_username = req.body.user_username
        let friend_id = req.body.friend_id
        let friend_doc = req.body.friend_doc
        let friend_fullname = req.body.friend_fullname
        let friend_username = req.body.friend_username

        if(!user_id || !friend_id || !friend_fullname || !friend_username || !user_fullname || !user_username || !friend_doc)
        {
            return res.status(401).json({
                success: false,
                message: "All field is required."
            })
        }

        await addDoc(collection(db, "users", user_id, "friends"),{
            user_id: friend_id,
            fullname: friend_fullname,
            username: friend_username
        })

        await addDoc(collection(db, "users", friend_id, "friends"),{
            user_id: user_id,
            fullname: user_fullname,
            username: user_username
        })

        await deleteDoc(doc(db, "users", user_id, "friend_requests", friend_doc))

        return res.status(200).json({
            success: true,
            message: "Acc friend success.",
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
})

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})

