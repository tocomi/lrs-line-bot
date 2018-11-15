const line = require('@line/bot-sdk');

/* setting in cloud functions */
const lineConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}

const lineClient = new line.Client(lineConfig);

function replyMessage(event, message) {
  let reply = undefined;

  reply = 'Land Roll Supermarketです！';

  if (reply) {
    lineClient.replyMessage(event.replyToken, { type: 'text', text: reply });
  }
}

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.reply = (req, res) => {
  
  const signature = req.get('x-line-signature');
  if (!signature) {
    throw new line.SignatureValidationFailed("no signature");
  }

  const event = req.body.events[0];
  const message = event.message.text;
  replyMessage(event, message);
};
