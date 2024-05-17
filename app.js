const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { obtenerRoommate } = require('./obtenerRoommate.js');

const app = express();
const PORT = 3000;

app.listen(PORT, console.log(`Servidor ON! en puerto ${PORT}`));
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/roommate", async (req, res) => {
    res.send(obtenerRoommate());
});

app.get("/roommates", (req, res) => {
    const roommatesJSON = JSON.parse(fs.readFileSync("roommates.json", "utf-8"));

    res.send(roommatesJSON);
});

app.get("/gastos", async (req, res) => {
    const gastosJSON = JSON.parse(fs.readFileSync("gastos.json", "utf-8"));

    res.send(gastosJSON);
});

app.post("/gasto", async (req, res) => {
    try {
        const { roommate, descripcion, monto } = req.body;
        const gasto = { id: uuidv4().slice(0, 6), roommate, descripcion, monto }

        const gastosJSON = JSON.parse(fs.readFileSync("gastos.json", "utf-8"));
        const gastos = gastosJSON.gastos;

        gastos.push(gasto);

        fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON));
        res.status(201).send("Gasto agregado exitosamente");
    } catch (error) {
        res.status(500).send("Ocurrió algo inesperado", error);
    }
});

app.put("/gasto", (req, res) => {
    try {
        const { id } = req.query;
        const { roommate, descripcion, monto } = req.body;

        const gasto = { id, roommate, descripcion, monto }

        const gastosJSON = JSON.parse(fs.readFileSync("gastos.json", "utf-8"));
        const gastos = gastosJSON.gastos;

        gastosJSON.gastos = gastos.map((g) => g.id === id ? gasto : g);

        fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON));

        res.status(201).send("Gasto editado exitosamente");
    } catch {
        res.status(500).send("Ocurrió algo inesperado")
    }
});

app.delete("/gasto", (req, res) => {
    try {
        const {id } = req.query
        const gastosJSON = JSON.parse(fs.readFileSync("gastos.json", "utf-8"));
        const gastos = gastosJSON.gastos;

        gastosJSON.gastos = gastos.filter((g) => g.id !== id);

        fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON));
        res.status(201).send("Gasto eliminado exitosamente");
    } catch {
        res.status(500).send("Ocurrió algo inesperado");
    }
});