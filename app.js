import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import bcrypt from 'bcrypt'
import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, query, where, getDocs, Timestamp, limit, getDoc } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBNeZoO8FXUTrwyGqVdHWyZmhCzMslLWbk",
  authDomain: "simple-chat-app-d0ab8.firebaseapp.com",
  databaseURL: "https://simple-chat-app-d0ab8-default-rtdb.firebaseio.com",
  projectId: "simple-chat-app-d0ab8",
  storageBucket: "simple-chat-app-d0ab8.appspot.com",
  messagingSenderId: "97021474830",
  appId: "1:97021474830:web:c65e86ece40a2dd7dc645f"
}

const app = express()
const port = 3030
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
            password: bcrypt.hashSync(password, 10),
            created_at: Timestamp.now(),
        })

        return res.status(200).json({
            success: true,
            message: "Register success.",
            data: {
                id: docRef.id,
                fullname: fullname,
                username: username,
                created_at: Timestamp.now()
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
            bcrypt.compare(password, doc.data().password, (err, result) => {

                if(result != true)
                {
                    return res.status(401).json({
                        success: false,
                        message: "Password is wrong."
                    })
                }

                return res.status(200).json({
                    success: true,
                    message: "Login success.",
                    data: {
                        id: doc.id,
                        fullname: doc.data().fullname,
                        username: doc.data().username,
                        created_at: doc.data().created_at
                    }
                })

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

        const usersRef = collection(db, "users", user_id)
        const docUser = await getDoc(usersRef)

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
                created_at: docUser.data().created_at
            }
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

