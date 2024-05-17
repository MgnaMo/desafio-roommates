const fs = require("fs");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const obtenerRoommate = async () => {
    try {
        const { data } = await axios.get('https://randomuser.me/api/');
        const generarRoommate = data.results[0];

        const roommate = {
            id: uuidv4().slice(0, 6),
            nombre: `${generarRoommate.name.first} ${generarRoommate.name.last}`,
            debe: "",
            recibe: "25000",
        };

        const { roommates } = JSON.parse(fs.readFileSync("roommates.json", "utf8"));

        roommates.push(roommate);
        fs.writeFileSync("roommates.json", JSON.stringify({ roommates }));
        
    return roommates;

    } catch (error) {
        console.error('Error obteniendo roommate:', error);
        throw error;
    }
};

module.exports = { obtenerRoommate }