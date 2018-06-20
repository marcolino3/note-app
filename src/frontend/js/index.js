import axios from 'axios';

async function getResults(query) {

    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const key = '06c4e505877664a06f621593fc14c3b6';

    try {
        const res = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${query}`);
        const recipes = res.data.recipes;
        console.log(recipes);
    } catch (err) {
        alert(err);
    }
}

getResults('tomato pasta');
