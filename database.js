import { MongoClient, ServerApiVersion } from 'mongodb';

async function create_client(uri) {
    return await new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }).connect();
}

async function upsert_student(client, studentData) {
    const result = await client
        .db('utdConnectDB')
        .collection('student')
        .updateOne(
            { email: studentData.email },
            { $set: studentData },
            { upsert: true }
        );
}

async function upsert_match(client, matchData) {
    const result = await client
        .db('utdConnectDB')
        .collection('match')
        .updateOne(
            { email: matchData.email },
            { $set: matchData },
            { upsert: true }
        );
}

async function retrieve_student_group(client) {
    const result = await client
        .db('utdConnectDB')
        .collection('mockstudents')
        .find({}, {projection:{ _id: 0 }})
        .toArray();

    return JSON.stringify(result);
}

async function retrieve_student(client, email_str) {
    const result = await client
        .db('utdConnectDB')
        .collection('student')
        .findOne({ email: email_str}, {projection:{ _id: 0 }});

    return result;
}

async function upsert_chat(client, chat_id, is_user, message) {
    const update = {
        is_user: is_user,
        text: message,
    }

    const result = await client
        .db('utdConnectDB')
        .collection('chathistory')
        .updateOne(
            { chat_id: chat_id },
            { $push: { history: update}},
            { upsert: true }
        );
}

async function retrieve_chat_history(client, chat_id) {
    const result = await client
        .db('utdConnectDB')
        .collection('chathistory')
        .findOne(
            { chat_id: chat_id},
            { projection: { history: 1, _id: 0 } }
        );

    if (result)
        return result.history
    return [];
}

async function retrieve_match_explanation(client, chat_id) {
    const result = await client
        .db('utdConnectDB')
        .collection('match')
        .findOne(
            { chat_id: chat_id},
            { projection: { explanation: 1, _id: 0 } }
        );

    if (result)
        return result.explanation
    return {};
}

async function end_chat(client, chat_id) {
    const result = await client
        .db('utdConnectDB')
        .collection('match')
        .deleteOne({ chat_id: chat_id});
}

async function retrieve_match_information(client, chat_id) {
    const matchDoc = await client
        .db('utdConnectDB')
        .collection('match')
        .findOne(
            { chat_id: chat_id},
            { projection: { match_email: 1, explanation: 1, icebreaker: 1, _id: 0 } }
        );
    
    const matchContext = await client
        .db('utdConnectDB')
        .collection('mockstudents')
        .findOne(
            { email: matchDoc.match_email },
            { projection: { first_name: 1, last_name: 1, email: 1, major: 1, year: 1, _id: 0 } }
        );
    
    matchContext.explanation = matchDoc.explanation;
    matchContext.icebreaker = matchDoc.icebreaker;
    
    return matchContext;
}

async function check_live_match(client, email) {
    const matchDoc = await client
        .db('utdConnectDB')
        .collection('match')
        .findOne(
            { email: email},
            { projection: { chat_id: 1, _id: 0 } }
        );
    
    if (matchDoc)
        return matchDoc.chat_id;
    return null;
}

export { create_client, retrieve_student, upsert_student, upsert_match, 
         retrieve_student_group, upsert_chat, retrieve_chat_history, retrieve_match_explanation,
         retrieve_match_information, check_live_match, end_chat };