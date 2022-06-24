
const { MongoClient } = require('mongodb')

var db
var assetsModel
var client

exports.connectDB = async () => {
    try {
        client = new MongoClient("mongodb://max:maxmax@18.141.24.92:27017/")
        await client.connect()
        db = await client.db('bigchain')
    } catch (error) {
        console.error(`MongoDB connection error: ${error}`);
    }
}
exports.Assets = async () => await db.collection('assets')
exports.Transactions = async () => await db.collection('transactions')
exports.Metadatas = async () => await db.collection('metadatas')
