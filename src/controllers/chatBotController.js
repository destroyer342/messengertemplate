require("dotenv").config();
import request from "request";

let postWebhook = (req, res) =>{
    // Parse the request body from the POST
    let body = req.body;

    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        body.entry.forEach(function(entry) {

            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);

            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);
    
            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }

        });

        // Return a '200 OK' response to all events
        res.status(200).send('EVENT_RECEIVED');

    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
};

let getWebhook = (req, res) => {
    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = process.env.MY_VERIFY_FB_TOKEN;

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
};

function handleMessage(sender_psid, message) {
    //handle message for react, like press like button
    // id like button: sticker_id 369239263222822

    if( message && message.attachments && message.attachments[0].payload){
     //   callSendAPI(sender_psid, "Thank you for watching my video !!!" +sender_psid);
        callSendAPIWithTemplate(sender_psid);
        return;
    }else {
      let response = {
            "text": `You sent the message: "${message.quick_replies.payload}"!`
          }
        callSendAPI(sender_psid,response);

    }

}

function handlePostback(sender_psid, received_postback) {
    let response;

    // Get the payload for the postback
    let payload = received_postback.payload;

    // Set the response based on the postback payload
    if (payload === 'yes') {
        response = {
            "text": `You click the getstarted button!`
          }
      
    } else if (payload === 'no') {
        response = { "text": "Oops, try sending another image." }
    }
    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response);
    
}


let persistentmenu = async (req, res) => {
    // Construct the message body
   
    let request_body = {
        "get_started": {
            "payload": "yes"
        },
        "persistent_menu": [
            {
                "locale": "default",
                "composer_input_disabled": false,
                "call_to_actions": [
                    {
                        "type": "web_url",
                        "title": "Shop now1",
                        "url": "https://www.coverage.ph/",
                        "webview_height_ratio": "compact"
                    },
               
                    {
                        "type": "web_url",
                        "title": "Shop now2",
                        "url": "https://www.coverage.ph/",
                        "webview_height_ratio": "tall"
                    },
                    {
                        "type": "web_url",
                        "title": "Shop now3",
                        "url": "https://www.coverage.ph/",
                        "webview_height_ratio": "full"
                    },
                    {
                        "type": "postback",
                        "title": "postback yes",
                        "payload": "yes",
              
                    }
                ]
            }
        ],
        "whitelisted_domains": [
            "https://www.coverage.ph/", //link to your Heroku app
            "https://www.mestemplate.herokuapp.com/",
        ]
    };
 
    // Send the HTTP request to the Messenger Platform
    return new Promise((resolve, reject) => {
        try {
            request({
                "uri": "https://graph.facebook.com/v13.0/me/messenger_profile",
                "qs": { "access_token": process.env.FB_PAGE_TOKEN },
                "method": "POST",
                "json": request_body
            }, (err, response, body) => {
                console.log('-------------------------------------------------------')
                console.log('Logs setup persistent menu & get started button: ', response.body)
                console.log('-------------------------------------------------------')
                if (!err) { 
                    return res.send('Setup done!')
                } else {
                    return res.send('Something wrongs with setup, please check logs...')
                }
            });
        } catch (e) {
            reject(e);
        }
    })
}




// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    };

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v13.0/me/messages",
        "qs": { "access_token": process.env.FB_PAGE_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!');
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}






let callSendAPIWithTemplate = (sender_psid) => {
    // document fb message template
    // https://developers.facebook.com/docs/messenger-platform/send-messages/templates
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "messaging_type": "RESPONSE",
        "message":{
          "text": "Pick a color:",
          "quick_replies":[
            {
              "content_type":"text",
              "title":"Red",
              "payload":"yes",
             "image_url":"https://toppng.com/uploads/preview/red-circle-1155276042606ekqvli9k.png"
            },{
              "content_type":"text",
              "title":"Green",
              "payload":"no",
              "image_url":"https://upload.wikimedia.org/wikipedia/commons/1/11/Pan_Green_Circle.png"
            }
          ]
        }
    };

    request({
        "uri": "https://graph.facebook.com/v13.0/me/messages",
        "qs": { "access_token": process.env.FB_PAGE_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            // console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
};

module.exports = {
  postWebhook: postWebhook,
  getWebhook: getWebhook,
  persistentmenu: persistentmenu

};