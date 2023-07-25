import * as dotenv from 'dotenv';
import {MineSweeper} from "./minesweeper";


(async () => {
    try {
        if (process.env.NETWORK != "nos_mainnet") {
            console.log("wrong network");
            return;
        }
        const game = new MineSweeper(process.env.NETWORK, process.env.PRIVATE_KEY, process.env.PUBLIC_KEY);
        const address = await game.deployUpgradeable(
            process.env.PUBLIC_KEY,
            "0x0000000000000000000000000000000000000000",
            "0x0000000000000000000000000000000000000000",
        );
        console.log("%s MineSweeper address: %s", process.env.NETWORK, address);
    } catch (e) {
        // Deal with the fact the chain failed
        console.log(e);
    }
})();