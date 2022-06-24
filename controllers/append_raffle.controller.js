var router = require('express').Router()
const user_wallet = require('../utils/user_wallet.json')
const { fetchLatestTransaction, updateSingleAsset } = require('../database/bigchaindb.database')
const { Assets, Transactions } = require('../database/mongodb.database')
const { createRaffle } = require('../modules/raffle.module')

// api/products
router.post('/append_raffle', async (req, res) => {
    try {
        const props = req.body

        const assetsModel = await Assets()
        const transactionsModel = await Transactions()

        if (!props?.did || !props?.count)
            return res.status(400).json("Unauthorized")

        var isCanAppend = true

        var fetchedLatestTransaction = await fetchLatestTransaction(props?.did)

        if (!fetchedLatestTransaction) {
            isCanAppend = false
            return res.status(400).json("Transaction does not exist")
        }

        // find the did
        var fetchedAsset = await assetsModel.findOne({
            "data.did": props?.did,
        })
        console.log(fetchedAsset?.id)
        var fetchedRaffleLatestTransaction = await fetchLatestTransaction(fetchedAsset?.id)
        console.log(fetchedRaffleLatestTransaction)


        var assetAppend

        if (!fetchedAsset) {
            console.log("creating")
            // if dont exist create
            assetAppend = await createRaffle({
                asset: {
                    type: "raffle",
                    did: props?.did
                },
                metadata: {
                    count: props?.count,
                },
                publicKey: user_wallet?.publicKey,
                privateKey: user_wallet?.privateKey
            })
        } else {
            console.log("updating")
            // console.log(fetchedRaffleLatestTransaction)
            console.log(fetchedRaffleLatestTransaction.metadata)
            fetchedRaffleLatestTransaction.metadata.count = fetchedRaffleLatestTransaction.metadata.count + props?.count
            assetAppend = await updateSingleAsset({
                txCreatedID: fetchedRaffleLatestTransaction?.id,
                metadata: fetchedRaffleLatestTransaction.metadata,
                publicKey: user_wallet.publicKey,
                privateKey: user_wallet.privateKey,
            })
            // console.log(assetAppend)
        }

        if (JSON.stringify(assetAppend) != JSON.stringify({})) {
            return res.status(200).json(assetAppend)
        } else {
            return res.status(200).json("false")
        }
    } catch (error) {
        return res.status(400).json("Server error")
    }
})

module.exports = router;


