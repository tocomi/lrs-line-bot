'use strict'

const line = require('@line/bot-sdk')

/* setting in cloud functions */
const lineConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}

const lineClient = new line.Client(lineConfig)

async function replyMessage(event, message) {
  let reply = undefined

  if (containsOsusume(message)) {
    reply = 'あなたへのオススメは、「' + selectSongRandom() + '」です！'
  }

  if (reply) {
    console.log(`replyMessage: ${reply}`)
    await lineClient.replyMessage(event.replyToken, { type: 'text', text: reply })
  }
}

const songList = [
  '大和撫子最強説',
  '舞姫',
  '五月雨舞踏会',
  '春の嵐',
  'レディ・ムラサキ',
  '都ロック',
  '雪に舞う花',
  '酔山',
  'KAGUYA',
  '桜吹雪',
  '五山炎上',
  '京乱フェイト',
  '桜花転生',
  '風林火山',
  '百回泣いて',
  '境界線',
  '逆転アンビ',
  'イド',
  '光',
  '君時間'
]
function selectSongRandom() {
  return songList[Math.floor(Math.random() * songList.length)]
}

const osusumeWord = [
  'おすすめ', 'オススメ'
]
function containsOsusume(message) {
  for (let word of osusumeWord) {
    if (message.includes(word)) {
      console.log('Osusume word contains.')
      return true
    }
  }
  console.log('No osusume word.')
  return false
}

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.reply = (req, res) => {
  
  const signature = req.get('x-line-signature')
  if (!signature) {
    throw new line.SignatureValidationFailed("no signature")
  }

  const event = req.body.events[0]
  const message = event.message.text
  console.log(`message: ${message}`)

  replyMessage(event, message).then(
    res.status(200).send('success')
  )

}
