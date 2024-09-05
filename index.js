const telegramAPI = require('node-telegram-bot-api')
const token = '7262277542:AAGv0hG0h_W8-XRX7-sjzoW4yoYli1Isp3g'
const bot = new telegramAPI(token, { polling: true })

// Object for storing chats and numbers
const chats = {}

// Game settings with buttons for selecting numbers
const gameOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: '1', callback_data: '1' },
        { text: '2', callback_data: '2' },
        { text: '3', callback_data: '3' },
      ],
      [
        { text: '4', callback_data: '4' },
        { text: '5', callback_data: '5' },
        { text: '6', callback_data: '6' },
      ],
      [
        { text: '7', callback_data: '7' },
        { text: '8', callback_data: '8' },
        { text: '9', callback_data: '9' },
      ],
      [{ text: '0', callback_data: '0' }],
    ],
  }),
}

// Option for the "Play Again" button
const againOption = {
  reply_markup: JSON.stringify({
    inline_keyboard: [[{ text: 'Play again', callback_data: '/again' }]],
  }),
}

// Function to launch the game
const startGame = async (chatID) => {
  await bot.sendMessage(
    chatID,
    'Now I will come up with a number from 0 to 9, and you try to guess it.'
  )
  const randomNum = Math.floor(Math.random() * 10)
  chats[chatID] = randomNum
  await bot.sendMessage(chatID, `Let's try to guess it.`, gameOptions)
}

// Setting up commands for the bot
bot.setMyCommands([
  { command: '/start', description: 'Initial greeting' },
  { command: '/info', description: 'Get user information' },
  { command: '/game', description: 'Start the guess number game' },
])

// Basic logic for message processing
const handleMessages = async (msg) => {
  const msgText = msg.text
  const chatID = msg.chat.id

  if (msgText === '/start') {
    await bot.sendSticker(
      chatID,
      'https://sl.combot.org/sad_crying_cat/webp/51xe29ca8.webp'
    )
    return bot.sendMessage(chatID, `Welcome to my bot.`)
  }

  if (msgText === '/info') {
    return bot.sendMessage(
      chatID,
      `Your name is: "${msg.from.first_name}${
        msg.from.last_name ? ' ' + msg.from.last_name : ''
      }"`
    )
  }

  if (msgText === '/game') {
    return startGame(chatID)
  }

  await bot.sendSticker(
    chatID,
    'https://sl.combot.org/sad_crying_cat/webp/8xf09f98a0.webp'
  )
  return bot.sendMessage(chatID, "Sorry, but I don't know this command.")
}

// Logic for processing callback requests
const handleCallbackQueries = async (msg) => {
  const dataMsgStr = msg.data
  const dataMsg = Number(msg.data)
  const chatID = msg.message.chat.id

  if (dataMsgStr === '/again') {
    return startGame(chatID)
  }

  if (dataMsg === chats[chatID]) {
    await bot.sendSticker(
      chatID,
      'https://sl.combot.org/sad_crying_cat/webp/33xf09f92b5.webp'
    )
    return bot.sendMessage(
      chatID,
      `Congratulations, your answer is correct. The number was ${chats[chatID]}.`,
      againOption
    )
  } else {
    await bot.sendSticker(
      chatID,
      'https://sl.combot.org/sad_crying_cat/webp/73xf09f98a0.webp'
    )
    return bot.sendMessage(
      chatID,
      `Unfortunately, you guessed wrong. The bot guessed the number ${chats[chatID]}.`,
      againOption
    )
  }
}

// Initializing the bot and handling events
const start = () => {
  bot.on('message', handleMessages)
  bot.on('callback_query', handleCallbackQueries)
}

// Launching the bot
start()
