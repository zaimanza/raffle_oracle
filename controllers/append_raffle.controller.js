var router = require('express').Router()
const useLocalStorage = require('../modules/useLocalStorage')
const usePlayer = require('../modules/usePlayer')
const useCollection = require('../modules/useCollection')
const useRaffle = require('../modules/useRaffle')
const useBigchaindb = require('../modules/useBigchaindb')
const user_wallet = require('../utils/user_wallet.json')
const useMongodb = require('../modules/useMongodb')

const { removeItem } = useLocalStorage()
const { getCollection, createCollection } = useCollection()
const { Assets, Transactions } = useMongodb()
const { getRaffles, createRaffle } = useRaffle()
const { player_login, player_logout, player_register, getPlayer } = usePlayer()
const { fetchLatestTransaction, updateSingleAsset } = useBigchaindb()
// api/products
router.post('/append_raffle', async (req, res) => {
    try {
        const props = req.body

        const assetsModel = await Assets()
        const transactionsModel = await Transactions()

        if (!props?.player_asset_id || !props?.count)
            return res.status(400).json("Unauthorized")

        var isCanAppend = true

        var fetchedLatestTransaction = await fetchLatestTransaction(props?.player_asset_id)

        if (!fetchedLatestTransaction) {
            isCanAppend = false
            return res.status(400).json("Transaction does not exist")
        }

        // find the player_asset_id
        var fetchedAsset = await assetsModel.findOne({
            "data.player_asset_id": props?.player_asset_id,
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
                    player_asset_id: props?.player_asset_id
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
            assetAppend = await updateSingleAsset({
                txCreatedID: fetchedRaffleLatestTransaction?.id,
                metadata: {
                    "count": 5
                },
                publicKey: user_wallet.publicKey,
                privateKey: user_wallet.privateKey,
            })
            console.log(assetAppend)
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


