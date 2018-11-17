'use strict'

const line = require('@line/bot-sdk')

/* setting in cloud functions */
const lineConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}

const lineClient = new line.Client(lineConfig)

async function replyMessage(replyToken, userName, message) {
  let reply = undefined

  reply = messageRandom()

  if (containsOsusume(message)) {
    reply = userName + 'さんへのオススメは、\n「' + selectSongRandom() + '」\nです！'
  }

  if (reply) {
    console.log(`replyMessage: ${reply}`)
    await lineClient.replyMessage(replyToken, { type: 'text', text: reply })
  }
}

const messageList = [
  '京都発4ピース和風ロックバンド。 2012年4月結成。\n結成以来、京都を中心に関西の様々なライブハウスやイベントで精力的にライブを行う。',
  '2012年9月、レコ発であり初の自主企画ライブを京都ソクラテスにて開催。\n多くの応援のもと70人を動員し、会場を満員にする。第一弾音源「暁」を発売。',
  '2013年3月、結成からわずか1年弱ながら、京都のバンド大会「ライブキッズvol.23」の一般部門ファイナリスト5組に選出される。\nまた、「十代白書」「トリガーフェス」「SOUND SHOCK」「Ro69jack」など大型フェスの上位審査へと駒を進める。',
  '2013年5月、JEUGIA主催「大学対抗MusicLiveChampionship」にてグランプリを受賞。',
  '2013年5月には2度目となるレコ発の自主企画ライブを京都MOJOにて開催。\n次世代の関西バンドシーンを担う若手有力バンドを集め、第2弾音源「錦」を発売。約100人を動員する。',
  '2013年9月、関西圏「学園祭ツアー」を開始。同志社大、京都府立大、大阪府立大、京都教育大、京都造形芸術大の計5大学の学園祭にてパフォーマンスを行う。',
  '2013年10月、横浜スタジアムにて「新横浜パフォーマンス2013」に出演。湘南乃風の『若旦那』との共演を果たす。\nまた、花火大会や寺社ライブなど様々な野外イベントでライブを行う。',
  '2014年3月には3度目にして最大規模の自主企画ライブ「都フェス」を京都FANJにて開催。\n関西若手インディーズシーンの先頭に立つバンドを集め、約100人を動員する大盛況のイベントとなる。',
  '2014年3月、「ライブキッズvol.24」へ2年連続の決勝進出を果たす。',
  '和風を基調としたメロディと文学的でストーリー性のある詞、力強い女性ボーカルと激しいギターサウンドが絡み合う「和風ロック」を武器に精力的に活動中。'
]
function messageRandom() {
  try {
    return messageList[Math.floor(Math.random() * 30)]
  } catch(e) {
    return undefined
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
  'おすすめ', 'オススメ', 'おススメ'
]
function containsOsusume(message) {
  for (const word of osusumeWord) {
    if (message.includes(word)) {
      console.log('Osusume word contains.')
      return true
    }
  }
  console.log('No osusume word.')
  return false
}

async function getUserName(userId) {
  const profile = await lineClient.getProfile(userId)
  return profile.displayName
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
  console.log(event)

  if (!event.message.text) {
    res.status(200).send('Not text message.')
    return;
  }
  const message = event.message.text

  getUserName(event.source.userId).then(userName => {
    console.log(`user: ${userName}, message: ${message}`)
    return replyMessage(event.replyToken, userName, message)
  }).then(() => {
    res.status(200).send('success')
  })

}
