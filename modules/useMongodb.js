
const { MongoClient } = require('mongodb')

var db
var assetsModel
var client

const useMongodb = () => {
    const connectDB = async () => {
        try {
            client = new MongoClient("mongodb://max:maxmax@18.141.24.92:27017/")
            await client.connect()
            db = await client.db('bigchain')
        } catch (error) {
            console.error(`MongoDB connection error: ${error}`);
        }
    }
    const Assets = async () => await db.collection('assets')
    const Transactions = async () => await db.collection('transactions')
    const Metadatas = async () => await db.collection('metadatas')

    return { connectDB, Assets, Transactions, Metadatas }
}
module.exports = useMongodb