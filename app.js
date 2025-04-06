import dotenv from 'dotenv';
dotenv.config();

import express, { json } from 'express';
import path from 'path';
import { check_live_match, create_client, end_chat, retrieve_chat_history, retrieve_match_explanation, retrieve_match_information, retrieve_student, retrieve_student_group, upsert_chat, upsert_match, upsert_student } from './database.js';
import { get_student_data } from './directory_scraper.js';
import { generateResponse, match_student } from './match_finder.js';

const uri = process.env.MONGODB_CONNECTION_STRING;
const client = await create_client(uri);

const app = express();
const port = 3000;

app.use('/static', express.static('static'))
app.use(express.json());
app.get('/', (req, res) => {
    res.sendFile(path.join(import.meta.dirname + '/static/html', 'login.html'));
});

app.post('/login', async (req, res) => {
    const email = req.body.email;
    const student_data = await get_student_data(email);
    res.send(student_data);
});

app.post('/check_match', async (req, res) => {
    const chat_id = await check_live_match(client, req.body.email);

    res.send({chat_id: chat_id});
});

app.post('/connect', async (req, res) => {
    const student_data = await get_student_data(req.body.email);
    student_data.about = req.body.about;

    const student_group_string = await retrieve_student_group(client);
    const matchData = await match_student(student_group_string, student_data);
    matchData.email = student_data.email;

    await upsert_student(client, student_data);
    await upsert_match(client, matchData);

    res.send({chat_id: matchData.chat_id});
});

app.get('/chat', async (req, res) => {
    res.sendFile(path.join(import.meta.dirname + '/static/html', 'chat.html'));
});

app.post('/match_information', async (req, res) => {
    const response = await retrieve_match_information(client, req.body.chat_id);
    res.send(response);
});

app.post('/end_chat', async (req, res) => {
    const response = await end_chat(client, req.body.chat_id);
    res.send({});
});

app.post('/chat_history', async (req, res) => {
    const response = await retrieve_chat_history(client, req.body.chat_id);
    res.send(response);
});

app.post('/update_chat', async (req, res) => {
    const chatId = req.body.chat_id;
    await upsert_chat(client, chatId, true, req.body.message);

    const chat_history = await retrieve_chat_history(client, chatId);
    const matchExplanation = await retrieve_match_explanation(client, chatId);
    const botResponse = await generateResponse(chat_history, matchExplanation);

    await upsert_chat(client, chatId, false, botResponse.message);
    res.send(botResponse);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})