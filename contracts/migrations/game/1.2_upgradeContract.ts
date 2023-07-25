import {MineSweeper} from "./minesweeper";

(async () => {
    try {
        if (process.env.NETWORK != "nos_mainnet") {
            console.log("wrong network");
            return;
        }
        const args = process.argv.slice(2);
        const nft = new MineSweeper(process.env.NETWORK, process.env.PRIVATE_KEY, process.env.PUBLIC_KEY);
        const address = await nft.upgradeContract(args[0]);
        console.log({address});
    } catch (e) {
        // Deal with the fact the chain failed
        console.log(e);
    }
})();