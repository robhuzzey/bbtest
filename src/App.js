import React, { Component } from 'react';
import './App.scss';
import Pokemon from './pokemon.json';

import Card from './Components/Card'
import Cards from './Components/Cards'
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';

class App extends Component {
    initialState = {
      players: [],
      playersTurn: 0,
      started: false,
      middleCards: [],
      lastWinner: {},
    }
    state = Object.assign({}, this.initialState)

    componentDidMount = () => {
      this.beginGame()
    }

    // Stolen array sort from : https://stackoverflow.com/a/2450976
    shuffleCards = (array) => {
      let currentIndex = array.length, temporaryValue, randomIndex
      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1
        // And swap it with the current element.
        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
      }

      return array
    }

    assignCardsToPlayers = (players) => {
      let playersWithCards = [].concat(players)
      const shuffledCards = this.shuffleCards([].concat(Pokemon))
      while(shuffledCards.length > 0) {
        playersWithCards = playersWithCards.map(player => {
          if (shuffledCards.length === 0) return player
          player.cards.push(shuffledCards.shift())
          return player
        })
      }
      return playersWithCards
    }

    generatePlayers = (numberOfPlayers) => {
      return [...Array(numberOfPlayers)].map((player, id) => {
        return {
          score: 0,
          cards: [],
          selectedCard: 0,
          id
        }
      })
    }

    beginGame = () => {
      const players = this.generatePlayers(2)
      const playersWithCards = this.assignCardsToPlayers(players)
      this.setState(() => {
        return Object.assign({}, this.initialState, {
          started: true,
          players: playersWithCards
        })
      })
    }

    determineWinner = (playerId, category) => {
      // Check all other players cards
      const winner = this.state.players.filter(player => player.id !== playerId).reduce((winner, player) => {
        if (winner.cards[winner.selectedCard].base[category] < player.cards[player.selectedCard].base[category]) winner = player
        return winner
      }, this.state.players[playerId]) // Start off assuming current player is the winner
      const player = this.state.players[playerId]
      this.moveCard(playerId, player.cards[player.selectedCard].id, winner.id)
      this.setState(() => {
        return {
          lastWinner: winner
        }
      })
    }

    moveCard = (playerId, cardId, winningPlayerId = null) => {
      const players = [].concat(this.state.players)
      const currentPlayer = players[this.state.playersTurn]
      const cardInPlay = currentPlayer.cards[currentPlayer.selectedCard]
      const cards = players[playerId].cards.filter(card => card.id !== cardId)
      players[playerId].cards = cards
      players[winningPlayerId].cards.push(cardInPlay)
      players[winningPlayerId].score++
      this.setState(() => {
        return {
          players
        }
      })
    }

    chooseAttribute = (playerId, category) => {
      this.determineWinner(playerId, category)
      this.chooseNextPlayer()
    }

    chooseNextPlayer = () => {
      let playersTurn = this.state.playersTurn + 1
      if(playersTurn > this.state.players.length - 1) {
        playersTurn = 0
      }
      this.setState(() => {
        return {
          playersTurn
        }
      })
    }

    render() {
        return (
          <Container>  
              {this.state.started && (
                <>
                  <Cards>
                    {this.state.players.map((player, i) => {
                      const playerId = i
                      const isPlaying = this.state.playersTurn === playerId
                      const score = player.score
                      const card = player.cards[player.selectedCard]
                      const playerState = isPlaying ? 'playing' : 'waiting'
                      return (
                        <Grid item xs={6} key={`card_${card.id}`}>
                          <div className={`player ${playerState}`}>
                            <h1>Player {playerId + 1} {this.state.lastWinner.id === playerId && 'Winner!'}</h1>
                            <p>Score {score}</p>
                            <p>Remaining cards count {player.cards.length}</p>
                            {player.cards.length > 0 && (
                              <Card 
                                isActive={isPlaying}
                                id={card.id}
                                name={card.name.english}
                                attributes={card.base}
                                chooseAttribute={(category, value) => {
                                  this.chooseAttribute(i, category)
                                }}
                              />
                            )}
                          </div>
                        </Grid>
                      )
                    })}
                  </Cards>
                  <Button variant="contained" color="secondary" onClick={this.beginGame}>Reset game</Button>
                </>
              )}
            </Container>
                


                // <header>
                //     <h1>Pokemon Top Trumps</h1>
                // </header>
                // <main>

                //     <h2>Rules of the game</h2>
                //     <p>
                //         Any number of people can play Top Trumps, that’s what makes it the world’s coolest card game!
                //         Here are instructions on how to play Top Trumps.
                //     </p>

                //     <p>
                //         To start the game, shuffle and deal all the cards face down. Each player holds their cards so
                //         that they can see the top card only.
                //     </p>

                //     <p>
                //         The player to the dealer’s left starts by reading out a category from the top card (e.g. Height,
                //         value 5) The other players then read out the same category from their cards. The one with the
                //         best or highest value wins, and that player collects all the top cards, including their own, and
                //         moves them to the bottom of their pile. It is then their turn again to choose a category from
                //         the next card.
                //     </p>

                //     <p>
                //         If two or more cards share the top value or data is not available for that particular subject
                //         then all the cards are placed in the middle and the same player chooses again from the next
                //         card. The winner of the hand takes the cards in the middle as well.
                //     </p>

                //     <p>The person with all the cards at the end is the winner.</p>
                //     <img src={Example} alt="Example top trumps cards" />
                //     <p>Example top trumps cards</p>
                //     <h2>The tasks</h2>
                //     <h4>Level 1</h4>
                //     <ol>
                //         <li>Render the Pokemon as Cards from data</li>
                //     </ol>
                //     <h4>Level 2</h4>
                //     <ol>
                //         <li>Render the Pokemon sprites</li>
                //         <li>Make the cards filterable by type</li>
                //         <li>Render cards differently by type</li>
                //     </ol>
                //     <h4>Level 3</h4>
                //     <ol>
                //         <li>Randomly deal the cards into two hands</li>
                //         <li>Show the first card in each hand</li>
                //         <li>Select an attribute to play e.g. Attack</li>
                //         <li>Show the winner of the hand</li>
                //         <li>Or show a tie hand</li>
                //         <li>Keep a score, or assign the round winner the losing card</li>
                //         <li>Example actions: Reset game, show all cards, start game</li>
                //     </ol>
                //     <p>
                //         <strong>Add, change or modify features as you see fit, have fun with it!</strong>
                //     </p>
                //     <p>
                //         <strong>Feel free to use react-plugins e.g. react-router, redux</strong>
                //     </p>
                // </main>
                // <footer>&copy; 2019 Brilliant Basics Ltd</footer>
        );
    }
}

export default App;
