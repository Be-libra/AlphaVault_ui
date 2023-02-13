const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
let mongoose = require("mongoose");
const { default: axios } = require("axios");
const transactions = require("./schema/transactions");
const blocks = require("./schema/blocks");

mongoose.connect(
    `mongodb+srv://alphaVaultTesting:PP6UsxYjteJR7I3d@cluster0.n2pkafn.mongodb.net/?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  );
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error: database"));
  db.once("open", function () {
    console.log("Database connected");
  });

  const moralisUrl = "https://deep-index.moralis.io/api/v2/block/8463585?chain=goerli"

const getBlockDetails = async(blockNumber, addresses, block) =>{
    try {
        const res = await axios({
            url : `https://deep-index.moralis.io/api/v2/block/${blockNumber}?chain=goerli`,
            method : "GET",
            headers :{
                "X-API-Key" : "PUX3SuXcL8sop16uK0fMwFsbqiBrZE0ty7buGH0SDV155W6tcoksEiUQaPG5FVMd"
            }
        })

        if(res && res.data){
            const transactions = res.data.transactions
            const savedData = await Promise.all(transactions.map(async transaction =>{
                try {
                    if(transaction && (addresses.includes(transaction.from_address?.toLowerCase()) || addresses.includes(transaction.to_address?.toLowerCase()))){
                        //save data in db
                        console.log(block);
                        const saveBlockdata = await saveBlockHash(block)
                        const data = await saveTransactions(transaction)
                        return data
                    }
                } catch (error) {
                    console.log(error);
                    return null
                }
            }))
        }
    } catch (error) {
        console.log(error);
    }
}

const saveTransactions = async(transaction) =>{
    try {
        const saveTransaction = await transactions.findOneAndUpdate({transaction_hash : transaction.hash},{
            fromAddress : transaction.from_address,
            toAddress : transaction.to_address,
            amount : parseInt(transaction.value),
            timestamp : parseInt(new Date(transaction.block_timestamp).getTime() / 1000) //convert to unix timestamp
        },
        {
            upsert  :true,
            new : true
        }
        )

        return saveTransaction
    } catch (error) {
        console.log(error);
        return null
    }
}

const saveBlockHash = async(block) =>{
    try {
        const findBlock = await blocks.findOne({block_hash : block.hash});

        if(findBlock){
            //update process
            const updatedBlockProcess = await blocks.findByIdAndUpdate(findBlock._id, {process : {$inc : 1}}, {upsert : false, new : true})

            return updatedBlockProcess
        }

        const newBlock = new blocks({
            block_hash : block.hash,
            parent_hash : block.parentHash,
            timestamp : block.timestamp
        })

        await newBlock.save()

        return newBlock
    } catch (error) {
        console.log(error); 
        return error
    }
}




const mnemonicPhrase = "later sing odor frozen stomach inherit kiwi crisp stumble remind cycle limb carry sniff eager choose alarm close phone mention marble slot ticket trust"

let provider = new HDWalletProvider({
    mnemonic: {
        phrase: mnemonicPhrase
    },
    providerOrUrl: "https://goerli.infura.io/v3/af19419a66534946a8e4ddf56396dd2d",
    numberOfAddresses : 100
});

const address = provider.getAddresses()

console.log(address);

const web3 = new Web3("wss://goerli.infura.io/ws/v3/af19419a66534946a8e4ddf56396dd2d")


let subscription = web3.eth.subscribe('newBlockHeaders', function(error, result){
    if (error)
        console.log(error,"result");
})
.on("connected", () =>{console.log("connected");})
.on("data", async(block) =>{
    const addresses = address.map(add => add.toLowerCase())

    setTimeout(async()=>{
        await getBlockDetails(block.number, addresses, block)
    }, 10000)
})
.on("error", (e)=>{
    console.log(e);
})
