import toggleSwitch from "../components/toggleSwitch.js"
import { TEAM_NAMES } from "../config.js"
import generateTeams from "./generate.js"

export function teamsAmountForm(container) {
    localStorage.clear()
    const form = document.createElement('form')
    const wrapper = document.createElement('div')
    const text = document.createElement('p')
    text.textContent = 'How many teams in tournament?'
    const input = document.createElement('input')
    input.name = 'amount'
    input.type = 'number'
    input.min = 2
    input.max = 40

    wrapper.append(text, input)
    
    const submitBtn = document.createElement('button')
    submitBtn.type = 'submit'
    submitBtn.textContent = 'OK'

    form.append(wrapper, submitBtn)
    container.append(form)

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const amount = e.target.amount.value
    
        if (amount) {
            let dropoutTeamsAmount = 0
            if (amount > 5) {
                dropoutTeamsAmount = 1
            } else if (amount > 10) {
                dropoutTeamsAmount = 2
            }

            form.remove()
            localStorage.setItem('dropout-amount', dropoutTeamsAmount)
            teamNamesForm(container, Number(amount))
        }
    })
}

export function teamNamesForm(container, teamsAmount) {
    const form = document.createElement('form')
    
    const text = document.createElement('p')
    text.textContent = `Set Teams' names`

    const namesWrapper = document.createElement('div')

    const generateWrapper = document.createElement('div')
    const select = document.createElement('select')
    const options = [
        {
            title: 'Alphabetized',
            value: 1
        }, 
        {
            title: 'Numbered',
            value: 2,
        },
        {
            title: 'Animals',
            value: 3,
        }
    ]


    for (let i = 0; i < options.length; i++) {
        const option = options[i];
        const optionElement = document.createElement('option')
        optionElement.textContent = option.title
        optionElement.value = option.value

        select.append(optionElement)
    }

    const generateNamesBtn = document.createElement('button')
    generateNamesBtn.type = 'button'
    generateNamesBtn.textContent = 'Generate'

    generateWrapper.append(select, generateNamesBtn)

    const submitBtn = document.createElement('button')
    submitBtn.type = 'submit'
    submitBtn.textContent = 'OK'

    for (let i = 0; i < teamsAmount; i++) {
        const div = document.createElement('div')
        const number = document.createElement('span')
        number.textContent = `${i+1}.`
        const input = document.createElement('input')
        input.type = 'text'
        input.required = true

        div.append(number, input)
        namesWrapper.append(div)
    }


    form.append(text, generateWrapper, namesWrapper, submitBtn)
    container.append(form)

    generateNamesBtn.addEventListener('click', (e) => {
        const optionValue = select.value
        const inputs = [...namesWrapper.querySelectorAll('input')]

        if (optionValue === '1') {
            const alphabet = Array.from({ length: teamsAmount }, (_, i) => String.fromCharCode(65 + i))

            alphabet.forEach((letter, i) => {
                inputs[i].value = letter
            })
        } else if (optionValue === '2') {
            const numbers = Array.from({ length: teamsAmount }, (_, i) => i + 1)

            numbers.forEach((number, i) => {
                inputs[i].value = number
            })
        } else {
            TEAM_NAMES.sort(() => Math.random() - 0.5).slice(0,teamsAmount).forEach((name, i) => {
                inputs[i].value = name
            })
        }
    })

    
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const teamNamesElements = [...document.querySelectorAll('input')]
        const teamNames = teamNamesElements.map(teamNameElement => teamNameElement.value)

        form.remove()
        tournamentType(container, teamsAmount)
        localStorage.setItem('team-names', JSON.stringify(teamNames))
    })
}


function tournamentType(container, teamsAmount) {
    const form = document.createElement('form')

    const leagueWrapper = document.createElement('div')
    leagueWrapper.classList.add('form-control')
    const leagueText = document.createElement('p')
    leagueText.textContent = 'League Game'

    const leagueSwitchHandler = (checked) => {
        if (checked) {
            const leagueInfoWrapper = document.createElement('div')
            leagueInfoWrapper.id = 'league-info'
            leagueInfoWrapper.classList.add('form-control', 'rounds-info')
    
            const text = document.createElement('p')
            text.textContent = 'How many rounds in tournament?'
    
            const input = document.createElement('input')
            input.name = 'amount'
            input.type = 'number'
            input.min = 1
            input.max = 5

            input.value = 1
            localStorage.setItem('rounds-amount', 1)

            input.addEventListener('change', (e) => {
                const amount = e.target.value
    
                if (amount) {
                    localStorage.setItem('rounds-amount', amount)
                }
            })
        
            leagueInfoWrapper.append(text, input)
            leagueWrapper.append(leagueInfoWrapper)
        } else {
            const oldLeagueInfoWrapper = document.getElementById('league-info')
            oldLeagueInfoWrapper.remove()
            localStorage.removeItem('rounds-amount')
        }
    }

    const legueSwitch = toggleSwitch(leagueSwitchHandler)

    leagueWrapper.prepend(leagueText, legueSwitch)

    const playoffsWrapper = document.createElement('div')
    playoffsWrapper.classList.add('form-control')
    const playoffsText = document.createElement('p')
    playoffsText.textContent = 'Playoffs'

    const playoffsSwitchHandler = (checked) => {
        if (checked) {
            const playoffsData = {
                teamsAmount: 0,
                roundsData: {},
            }

            const playoffsInfoWrapper = document.createElement('div')
            playoffsInfoWrapper.id = 'playoffs-info'
            playoffsInfoWrapper.classList.add('form-control', 'rounds-info')
    
            const teamsAmountWrapper = document.createElement('div')

            const teamsAmountText = document.createElement('p')
            teamsAmountText.textContent = 'How many teams play in Playoffs?'
    
            const possibleAmounts = []
            const dropoutTeamsAmount = localStorage.getItem('dropout-amount')
            teamsAmount = teamsAmount - Number(dropoutTeamsAmount)
            let minAmount = 2

            for (let i = 0; i < teamsAmount; i++) {
                if (i === 0) {
                    possibleAmounts.push(minAmount)
                    minAmount = minAmount*2
                } else if (minAmount <= teamsAmount) {
                    possibleAmounts.push(minAmount)
                    minAmount = minAmount*2
                }
            }

           

            const possibleAmountsSelect = document.createElement('select')

            for (let i = 0; i < possibleAmounts.length; i++) {
                const possibleAmount = possibleAmounts[i];
                console.log(i, possibleAmount);
                const option = document.createElement('option')       

                option.textContent = possibleAmount
                option.value = possibleAmount

                possibleAmountsSelect.append(option)
            }

            teamsAmountWrapper.append(teamsAmountText, possibleAmountsSelect)
        
            playoffsInfoWrapper.append(teamsAmountWrapper)
            
            generatePlayoffsData(playoffsInfoWrapper, 2, playoffsData)
            possibleAmountsSelect.addEventListener('change', (e) => {
                const amount = Number(e.target.value)

                generatePlayoffsData(playoffsInfoWrapper, amount, playoffsData)
              
            })

     
            playoffsWrapper.append(playoffsInfoWrapper)
        } else {
            const oldPlayoffsInfoWrapper = document.getElementById('playoffs-info')
            oldPlayoffsInfoWrapper.remove()
            localStorage.removeItem('playoffs-data')
        }
    }


    const playoffsSwitch = toggleSwitch(playoffsSwitchHandler)
       
    playoffsWrapper.prepend(playoffsText, playoffsSwitch)

    const submitBtn = document.createElement('button')
    submitBtn.type = 'submit'
    submitBtn.textContent = 'SUBMIT'

    form.append(leagueWrapper, playoffsWrapper, submitBtn)
    container.append(form)

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const leagueData = localStorage.getItem('rounds-data')
        const playoffsData = localStorage.getItem('playoffs-data')
        
        if (leagueData || playoffsData) {
            form.remove()
            generateTeams(container)
        }
    })
}

function generatePlayoffsData(playoffsInfoWrapper, teamsAmount, playoffsData) {
    playoffsData.teamsAmount = teamsAmount
    let roundGamesAmount = teamsAmount/2
    let prevRoundGamesAmount
    let roundsInfo = []

    for (let i = 0; i < teamsAmount/2; i++) {
        if (i > 0) {
            roundGamesAmount = roundGamesAmount/2
        }

        if (prevRoundGamesAmount !== roundGamesAmount) {
            roundGamesAmount >= 1 && roundsInfo.push(roundGamesAmount)
        }
        prevRoundGamesAmount = roundGamesAmount
    }

    console.log(roundsInfo);
    playoffsData.roundsData = {}
    roundsInfo.forEach(gamesAmount => {
        const property = gamesAmount === 1 ? 'final' : `1/${gamesAmount}`
        playoffsData.roundsData[property] = {}
        playoffsData.roundsData[property].gamesAmount = gamesAmount
        playoffsData.roundsData[property].knockouts = 1
    })
    localStorage.setItem('playoffs-data', JSON.stringify(playoffsData))

    console.log(playoffsData);
    const prevRoundsInfoWrapper = document.getElementById('rounds-info-wrapper')
    prevRoundsInfoWrapper && prevRoundsInfoWrapper.remove()

    const roundsInfoWrapper = document.createElement('div')
    roundsInfoWrapper.id = 'rounds-info-wrapper'

    const roundsInfoTitle = document.createElement('p')
    roundsInfoTitle.textContent = 'Knockouts single/double?'

    roundsInfoWrapper.append(roundsInfoTitle)

    Object.keys(playoffsData.roundsData).forEach(round => {
        const roundWrapper = document.createElement('div')
        const roundElement = document.createElement('span')
        roundElement.textContent = round

        const buttonsWrapper = document.createElement('div')
        const singleKnockoutBtn = document.createElement('button')
        singleKnockoutBtn.type = 'button'
        singleKnockoutBtn.textContent = 'single'
        const doubleKnockoutBtn = document.createElement('button')
        doubleKnockoutBtn.type = 'button'
        doubleKnockoutBtn.textContent = 'double'

        singleKnockoutBtn.classList.add('clicked')

        console.log(playoffsData);

        singleKnockoutBtn.addEventListener('click', (e) => {
            doubleKnockoutBtn.classList.remove('clicked')
            singleKnockoutBtn.classList.add('clicked')

            playoffsData.roundsData[round].knockouts = 1
            localStorage.setItem('playoffs-data', JSON.stringify(playoffsData))
        })

        doubleKnockoutBtn.addEventListener('click', (e) => {
            singleKnockoutBtn.classList.remove('clicked')
            doubleKnockoutBtn.classList.add('clicked')

            playoffsData.roundsData[round].knockouts = 2

            localStorage.setItem('playoffs-data', JSON.stringify(playoffsData))
        })
        
        buttonsWrapper.append(singleKnockoutBtn, doubleKnockoutBtn)
        roundWrapper.prepend(roundElement, buttonsWrapper)
        roundsInfoWrapper.append(roundWrapper)
    })

    playoffsInfoWrapper.append(roundsInfoWrapper)
}

 
function roundsAmountForm(container) {
    const form = document.createElement('form')
    const wrapper = document.createElement('div')
    const text = document.createElement('p')
    text.textContent = 'How many rounds in tournament?'

    const input = document.createElement('input')
    input.name = 'amount'
    input.type = 'number'
    input.min = 1
    input.max = 5

    wrapper.append(text, input)
    
    const submitBtn = document.createElement('button')
    submitBtn.type = 'submit'
    submitBtn.textContent = 'OK'

    form.append(wrapper, submitBtn)
    container.append(form)

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const amount = e.target.amount.value
    
        if (amount) {
            form.remove()
            localStorage.setItem('rounds-amount', amount)
            generateTeams(container, amount)
        }
    })
}