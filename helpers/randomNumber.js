const randomNumber = {
    createFarmID : async () =>{
            randomID = await Math.floor(Math.random() * 100000);
            if (randomID < 100000)
                randomID += 100000;
            return  randomID;
    },

    createReserveID : async () =>{
        randomID = await Math.floor(Math.random() * 1000000);
        if (randomID < 1000000)
            randomID += 1000000;
        return  randomID;
}
}

module.exports = randomNumber;