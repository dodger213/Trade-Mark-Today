import stringSimilarity from 'string-similarity'
import natural, { TfIdf, WordNet } from 'natural';
import keywordsModel from '@/models/keywordsModel';
// ! Search for similar words from the keywords START
const performSearch = (query: string, processedProductNames: string[]) => {
    // Find matches based on string similarity
    const matches = stringSimilarity.findBestMatch(query, processedProductNames);
    // Get the top matching results
    const results = matches.ratings
        .filter(({ rating }) => rating > 0.5) // Adjust the threshold as needed
        .map(({ target }) => target);
    return results;
}
export const searchSimilarWordsFromKeywords = async (query:string) => {
    try {
        const keywords:string[] = ((await keywordsModel.find()) as {keyword:string}[]).map(row => row.keyword);
        const searchResults = performSearch(query, keywords);
        return searchResults;
    }
    catch (error) {
        console.log(error);
    }
}
// ! Search for similar words from the keywords END
export const getSynonyms = async (inputWord:string) => {
    return new Promise((resolve, reject) => {9
        const wordnet = new WordNet();
        wordnet.lookup(inputWord, (definitions) => {
            {
                const similarWords = definitions.reduce((words:string[], definition) => {
                    definition.synonyms.forEach((synonym) => {
                        if (!words.includes(synonym)) 
                        {
                            words.push(synonym);
                        }
                    });
                    return words;
                }, []);
                resolve(similarWords);
            }
        });
    });
};