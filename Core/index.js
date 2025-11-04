const { glob } = require("glob");
const { promisify } = require("util");
const { Client, Collection } = require("discord.js");

// Mengubah glob menjadi fungsi berbasis promise
const globPromise = promisify(glob);

module.exports = async (client) => {
    // Membuat koleksi untuk commands, buttons, dan modals
    client.commands = new Collection();
    client.buttons = new Collection();
    client.modals = new Collection();

    // Mencari semua file command dengan pola tertentu
    const commandFiles = await globPromise(`${process.cwd()}/Commands/**/*.js`);
    commandFiles.map((value) => {
        const file = require(value); // Memuat file command
        const splitted = value.split("/");
        const directory = splitted[splitted.length - 2];

        if (file.name) {
            const properties = { directory, ...file };
            client.commands.set(file.name, properties); // Menambahkan command ke koleksi
            console.log(`[Kata Perintah yang tersedia]: ${file.name}`);
        }
    });

    // Mencari dan memuat semua file event
    const eventFiles = await globPromise(`${process.cwd()}/Events/*.js`);
    eventFiles.map((value) => require(value));

    // Mencari dan memuat semua file tombol
    const buttonsFolder = await globPromise(`${process.cwd()}/Tombol/**/*.js`);
    buttonsFolder.map((value) => {
        const file = require(value);
        if (!file.id) return;
        client.buttons.set(file.id, file); // Menambahkan tombol ke koleksi
        console.log(`[Tombol yang tersedia]: ${file.id}`);
    });

    // Mencari dan memuat semua file modals
    const modalsFolder = await globPromise(`${process.cwd()}/Modals/*.js`);
    modalsFolder.map((value) => {
        const file = require(value);
        if (!file.id) return;
        client.modals.set(file.id, file); // Menambahkan modal ke koleksi
    });
};
