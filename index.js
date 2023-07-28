import crypto from "crypto"
import fs from 'fs'
import express from "express"
// Generating RSA key pairs(public and private key)
// const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
//     // The length of our RSA keys is 3072 bits
//     modulusLength: 3072,
// })

//print RSA public key and private key
const privateKey = fs.readFileSync("./evat-rsa-priv-key.pem")
const publicKey = fs.readFileSync("./evat-rsa-pub-key.pem")
// console.log(
//     publicKey.export({
//         type: "pkcs1",
//         format: "pem",
//     }),

//     privateKey.export({
//         type: "pkcs1",
//         format: "pem",
//     })
// )
// fs.writeFileSync("./evat-rsa-pub-key.pem", publicKey.export({
//     type: "pkcs1",
//     format: "pem",
// }))
// fs.writeFileSync("./evat-rsa-priv-key.pem", privateKey.export({
//     type: "pkcs1",
//     format: "pem",
// }))
// This is our secret data
const secretData = "Your Secret Really"

const encryptedData = (secretData) => crypto.publicEncrypt(
    {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha512",
    },
    // Converting string to a buffer 
    Buffer.from(secretData, 'utf-8')

)



//print encrypted data it in base64 format
// console.log("encypted data: ", encryptedData.toString("base64"))

const decryptedData = (encryptedData) =>
    crypto.privateDecrypt(
        {
            key: privateKey,
            // decrypt the data
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha512",
        },
        encryptedData
    )


const app = express()

app.use(express.json())
let temp = null
app.get("/encrypt", (req, res) => {
    temp = encryptedData(req.query["data"]).toString("base64")
    console.log(req.query["data"]);
    res.json(temp)
})
app.get("/decrypt", (req, res) => {
    console.log({ hey: req.body.data });
    try {
        let temp =  crypto.privateDecrypt(
            {
                key: privateKey,
                // decrypt the data
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: "sha512",
            },
            Buffer.from(req.body.data, "utf8")
            
        )
        temp.toString()
        res.json(temp)
    } catch (error) {
        console.log({ error })
        res.status(500).json({ msg: "Error" })
    }
})

app.listen("5000", () => console.log("Server is up"))