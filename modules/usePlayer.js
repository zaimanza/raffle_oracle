const bip39 = require('bip39')
const BigChainDB = require('bigchaindb-driver')
const useLocalStorage = require('./useLocalStorage')

const usePlayer = () => {

    const { setItem, getItem, removeItem } = useLocalStorage()

    const player_login = async ({ mnemonic }) => {

        const seed = (await bip39.mnemonicToSeed(mnemonic)).slice(0, 32)
        const player = new BigChainDB.Ed25519Keypair(seed)

        await setItem({
            key: "player",
            value: JSON.stringify(player)
        })

        return {
            mnemonic: mnemonic,
            private: player.privateKey,
            public: player.publicKey,
        };
    }

    const player_logout = async () => {


        await removeItem({
            key: "player"
        })

        return true;
    }

    const player_register = async () => {
        const mnemonic = bip39.generateMnemonic()

        const seed = (await bip39.mnemonicToSeed(mnemonic)).slice(0, 32)
        const player = new BigChainDB.Ed25519Keypair(seed)

        setItem({
            key: "player",
            value: JSON.stringify(player)
        })

        return {
            mnemonic: mnemonic,
            private: player.privateKey,
            public: player.publicKey,
        }
    }

    const getPlayer = async () => {
        try {
            return await JSON.parse(
                await getItem({
                    key: "player"
                })
            )
        } catch (err) {
            return
        }
    }

    return { player_logout, player_login, player_register, getPlayer }
}

module.exports = usePlayer