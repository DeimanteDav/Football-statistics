import leagueTournament from "../../components/league/leagueTournament.js";
import titleWrapper from "../../components/titleWrapper.js";
import { SPORTS } from "../../config.js";
import BasketballTeam from "../../classes/BasketballTeam.js";
import FootballTeam from "../../classes/FootballTeam.js";
import generateGames from "./generateGames.js";
import RegularSeason from "../../classes/RegularSeason.js";
import { Container } from "../../types.js";
import playoffsForm from "../../components/playoffs/playoffsForm.js";
import Playoffs from "../../classes/Playoffs.js";

function generateTeams(container: Container) {
    const teamNames: string[] = localStorage.getItem('team-names') ? JSON.parse(localStorage.getItem('team-names') || '') : null

    // const leagueRoundsAmount = localStorage.getItem('rounds-amount') ? JSON.parse(localStorage.getItem('rounds-amount') || '') : null
    // const playoffsData = localStorage.getItem('playoffs-data') ? JSON.parse(localStorage.getItem('playoffs-data') || '') : null
    const sportId = localStorage.getItem('sport') ? JSON.parse(localStorage.getItem('sport') || '').id : null

    const regularSeason = RegularSeason.getData()

    const playoffs = Playoffs.getData()

    let team: typeof FootballTeam | typeof BasketballTeam
    if (sportId === SPORTS.football.id) {
        team = FootballTeam
    } else if (sportId === SPORTS.basketball.id) {
        team = BasketballTeam
    }



    if (regularSeason) {
        const totalGames = regularSeason?.roundsAmount ? (teamNames.length-1)* regularSeason?.roundsAmount : (teamNames.length-1)

        const leagueTeams = teamNames.map((name, i) => new team(name, i+1, totalGames, teamNames.length))

        const games = generateGames(sportId, leagueTeams, regularSeason?.roundsAmount)

        RegularSeason.setGamesAmount(totalGames)
        RegularSeason.setTeams(leagueTeams)
        RegularSeason.setGames(games)


        titleWrapper(container)
        // leagueTournament(container, games, leagueTeams)
        leagueTournament(container)

        if (playoffs) {
            Playoffs.setTeams(leagueTeams)
            
            playoffsForm(container)
        }
    } else if (playoffs) {
        const allTeams = teamNames.map((name, i) => new team(name, i+1, playoffs?.teamsAmount, teamNames.length))

        Playoffs.setTeams(allTeams)
        
        titleWrapper(container)
        // playoffsForm(container, playoffsData, playoffTeams)
        playoffsForm(container)
    }
}

export default generateTeams