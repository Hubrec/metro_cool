
const LOCALAPIURL = 'http://localhost:3000/api/data/';
const APIURL = 'http://api.metrocool.mathisguerin.fr/api/data/';

export async function extractNodes() {
    const response = await fetch(LOCALAPIURL + 'stations');
    return await response.json();
}

export async function extractLinks() {
    const response = await fetch(LOCALAPIURL + 'links');
    return await response.json();
}

