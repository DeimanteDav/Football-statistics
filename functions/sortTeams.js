import { SPORTS } from "../config.js"
import compareGamesData from "./compareGamesData.js"

export default function sortTeams(teams, games, params = {}) {
    const {compareBetweenGames} = params
    const samePointsTeams = []

    const sportId = JSON.parse(localStorage.getItem('sport')).id

    const result = teams.sort((a, b) => {
        if (a.points > b.points) {
            return -1
        } else if (a.points < b.points) {
            return 1
        } else {
            !samePointsTeams.includes(a) && samePointsTeams.push(a)
            !samePointsTeams.includes(b) && samePointsTeams.push(b)
            const teamsGameData = compareGamesData(samePointsTeams, games);
            if (sportId === SPORTS.football.id) {
                if (compareBetweenGames) {
                    if (teamsGameData.length === 0) {
                        return 0
                    }
        
                    if (teamsGameData[a.team].points > teamsGameData[b.team].points) {
                        return -1
                    } else if (teamsGameData[a.team].points < teamsGameData[b.team].points) {
                        return 1
                    }
            
                    if (teamsGameData[a.team].goalDifference > teamsGameData[b.team].goalDifference) {
                        return -1
                    } else if (teamsGameData[a.team].goalDifference < teamsGameData[b.team].goalDifference) {
                        return 1
                    }
            
                    if (teamsGameData[a.team].goals > teamsGameData[b.team].goals) {
                        return -1
            
                    } else if (teamsGameData[a.team].goals < teamsGameData[b.team].goals) {
                        return 1
                    }
                }
                
                if (a.goalDifference > b.goalDifference) {
                    return -1
                } else if (a.goalDifference < b.goaDifference) {
                    return 1
                } 
        
                if (a.goals > b.goals) {
                    return -1
                } else if (a.goals < b.goals) {
                    return 1
                } 
        
                if (a.awayGoals > b.awayGoals) {
                    return -1
                } else if (a.awayGoals < b.awayGoals) {
                    return 1
                } 
        
                if (a.wins > b.wins) {
                    return -1
                } else if (a.wins < b.wins) {
                    return 1
                }
        
                if (a.awayWins > b.awayWins) {
                    return -1
                } else if (a.awayWins < b.awayWins) {
                    return 1
                }
        
                if (a.playedGames > b.playedGames) {
                    return -1
                } else if (a.playedGames < b.playedGames) {
                    return 1
                }
            } else if (sportId === SPORTS.basketball.id) {
                if (a.winPerc > b.winPerc) {
                    return -1
                } else if (a.winPerc < b.winPerc) {
                    return 1
                }

                if (compareBetweenGames) {
                    if (teamsGameData.length === 0) {
                        return 0
                    }

                    if (teamsGameData[a.team].wins > teamsGameData[b.team].wins) {
                        return -1
                    } else if (teamsGameData[a.team].wins < teamsGameData[b.team].wins) {
                        return 1
                    }
                    if (teamsGameData[a.team].goalDifference > teamsGameData[b.team].goalDifference) {
                        return -1
                    } else if (teamsGameData[a.team].goalDifference < teamsGameData[b.team].goalDifference) {
                        return 1
                    }
                }

                if (a.goalDifference > b.goalDifference) {
                    return -1
                } else if (a.goalDifference < b.goalDifference) {
                    return 1
                }

                if (a.goals > b.goals) {
                    return -1
                } else if (a.goals < b.goals) {
                    return 1
                }
            }
        }
    
        return 0
    })

    return result
}