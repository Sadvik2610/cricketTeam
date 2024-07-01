const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const app = express()
app.use(express.json())
let db = null
const dbPath = path.join(__dirname, 'cricketTeam.db')
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running')
    })
  } catch (e) {
    console.log(`DB ERROR : ${e.message}`)
    process.exit(1)
  }
}
initializeDBAndServer()
//AP1
app.get('/players/', async (request, response) => {
  const getSpecificPlayerQuery = `SELECT *
    FROM cricket_team
    ORDER BY player_id; `
  const playerArray = await db.all(getSpecificPlayerQuery)
  response.send(playerArray)
})
//AP2
app.post('/players/', async (request, response) => {
  const playerDetails = request.body
  const {player_id, player_name, jersey_name, role} = playerDetails
  const playerQuery = `INSERT INTO 
  cricket_team(player_id,player_name,jersey_name,role)
    VALUES(
        '${player_id}',
        '${player_name}',
        '${jersey_name}',
        '${role}',
    );`
  const dbResponse = await db.run(playerQuery)
  const playerId = dbResponse.lastId
  response.send('Player Added to Team')
})
//AP3
app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getPlayerQuery = `SELECT 
    *
    FROM cricket_team
    WHERE player_id = ${playerId};`
  const player = await db.get(getPlayerQuery)
  response.send(player)
})
//AP4
app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerDetails = request.body
  const {player_id, player_name, jersey_name, role} = playerDetails
  const updateQuery = `UPDATE
      cricket_team
    SET
       player_id =   ${player_id},
       player_name =     ${player_name},
       jersey_name =    ${jersey_name},
        role =    ${role},
      
    WHERE
      player_id = ${playerId};`
  await db.run(updateQuery)
  response.send('Player Details Updated')
})
//AP5
app.delete('/players/:playerId', async (request, response) => {
  const {playerId} = request.params
  const deleteQuery = `DELETE FROM cricket_team
    WHERE player_id = ${playerId};`
  await db.run(deleteQuery)
  response.send('Player Removed')
})
module.exports = app
