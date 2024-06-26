import RegularSeason from "../../classes/RegularSeason.js";
import compareGamesData from "../../functions/league/compareGamesData.js";
import getModernTableHeadItems from "../../functions/league/getModernTableHeadItems.js";
import sortTeams from "../../functions/sortTeams.js";
import { GamesType } from "../../types.js";
import modernLeagueTable from "./modernLeagueTable.js";
import oldLeagueTable from "./oldLeagueTable.js";

function comparisonTable(wrapper: HTMLElement, data: RegularSeason) {
    const {games, sportType} = data
    const teams = localStorage.getItem('comparing-teams') && JSON.parse(localStorage.getItem('comparing-teams') || '')

    const sportId: number = localStorage.getItem('sport') && JSON.parse(localStorage.getItem('sport') || '').id

    const tableType = localStorage.getItem('table-type')

    const teamsGamesDataObject = compareGamesData(sportType.id, teams, games)

    const teamsData = teamsGamesDataObject && Object.values(teamsGamesDataObject).map((data) => ({...data}))

    const sortedTeams = sortTeams(sportType.id, teamsData, games)


    let updatedTeams

    if (sortedTeams.length > 0) {
        updatedTeams = sortedTeams
    } else if (teams.length === 1) {
        const headItems = getModernTableHeadItems(sportId)

        const team = {...teams[0]}
        headItems?.forEach((item, i) => {
            if (i !== 0) {
                if (typeof team[item.selector] === 'number') {
                    team[item.selector] = 0
                } else if (typeof team[item.selector] === 'object') {
    
                    team[item.selector].won = 0
                    team[item.selector].lost = 0
                }
            }
        })
        
        updatedTeams = [team]
    }

    if (!updatedTeams) {
        return
    }
    
    if (tableType === 'old') {
        oldLeagueTable(wrapper, data.sportType, games, updatedTeams, {comparisonTable: true})
    } else {
        modernLeagueTable(wrapper, data.sportType, games, updatedTeams, {comparisonTable: true})
    }
}

export default comparisonTable