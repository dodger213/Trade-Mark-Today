import natural, { TfIdf, WordNet } from 'natural';
import stringSimilarity from 'string-similarity'
import { Request, Response } from "express";
import keywordsModel from '@/models/keywordsModel'

export default async function handler(req: Request, res: Response) {
    if (req.method === 'GET') {

        try {
            const keywords:string[] = ((await keywordsModel.find()) as {keyword:string}[]).map(row => row.keyword);
            const query = req.query.search as string;
            const searchResults = performSearch(query, keywords);
            console.log(searchResults);
            res.status(200).json(searchResults);
        }
        catch (error) {
            console.error(error);
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' })
    }
}
function preprocessProductNames(productNames: string[]) {
    const processedNames = productNames.map(name => {
        // Remove special characters and convert to lowercase
        const processedName = name.replace(/[^\w\s]/gi, '').toLowerCase();

        // Split into individual words
        const words = processedName.split(' ');

        return words;
    });

    return processedNames;
}

function performSearch(query: string, processedProductNames: string[]) {
    // Find matches based on string similarity
    const matches = stringSimilarity.findBestMatch(query, processedProductNames);

    // Get the top matching results
    const results = matches.ratings
        .filter(({ rating }) => rating > 0.5) // Adjust the threshold as needed
        .map(({ target }) => target);

    return results;
}