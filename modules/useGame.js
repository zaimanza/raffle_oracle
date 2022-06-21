const useBigchaindb = require("./useBigchaindb")
const useMongodb = require("./useMongodb")

const useGame = () => {

    const { Assets, Transactions } = useMongodb()
    const { fetchLatestTransaction, createSingleAsset, updateSingleAsset } = useBigchaindb()

    const createGame = async ({ asset, metadata, publicKey, privateKey }) => {
        try {
            let isExists = false
            let latestTransaction

            // find player pnya transactions
            const transactionsModel = await Transactions()
            const assetsModel = await Assets()

            const fetchedTransactions = await transactionsModel.find({
                "operation": "CREATE",
                "inputs.owners_before": publicKey
            }, { projection: { id: 1, _id: 0 } }).toArray()

            // find with condition nama game and ................
            for (const transaction of fetchedTransactions) {

                const fetchedData = await assetsModel.find({
                    "id": transaction.id,
                    "data.game_name": asset.game_name
                }).toArray()

                if (fetchedData) isExists = true

                latestTransaction = await fetchLatestTransaction(transaction.id)

            }
            // // IF TAK WUJUD baru ampa create

            if (isExists == false) {
                latestTransaction = await createSingleAsset({
                    asset: asset,
                    metadata: metadata,
                    publicKey: publicKey,
                    privateKey: privateKey,
                })
            }

            return latestTransaction

        } catch (error) {
            res.status(400).json(error);
        }

    }

    const appendGame = async ({ asset, metadata, publicKey, privateKey }) => {
        try {
            let latestTransaction
            let assetAppend

            // find player pnya transactions
            const transactionsModel = await Transactions()
            const assetsModel = await Assets()

            const fetchedTransactions = await transactionsModel.find({
                "operation": "CREATE",
                "inputs.owners_before": publicKey
            }, { projection: { id: 1, _id: 0 } }).toArray()

            // find with condition nama game and ................
            for (const transaction of fetchedTransactions) {

                const fetchedData = await assetsModel.find({
                    "id": transaction.id,
                    "data.game_name": asset.game_name
                }).toArray()
                if (fetchedData) {
                    const previousData = await fetchLatestTransaction(transaction.id)
                    metadata.score = metadata.score + previousData.metadata.score

                    assetAppend = await updateSingleAsset({
                        txCreatedID: transaction.id,
                        metadata: metadata,
                        publicKey: publicKey,
                        privateKey: privateKey,
                    })
                }

                // latestTransaction = await fetchLatestTransaction(transaction.id)

            }
            // // IF TAK WUJUD baru ampa create

            // find with condition nama game and ................
            // update data

            return assetAppend


        } catch (error) {
        }

    }

    return { createGame, appendGame }
}

module.exports = useGame