import mysql from 'mysql'
import natural, { TfIdf } from 'natural';
import stringSimilarity from 'string-similarity';

const mysqldb = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'trademarktoday'
})

export default mysqldb;





//!Todo delete
// function intelligentSearch() {
//     const tokenizer = new natural.WordTokenizer();
//     const userInputTokens = tokenizer.tokenize(userInput);

//     // Retrieve description data from the database
//     const query = 'SELECT product FROM products';
//     db.query(query, (error, rows) => {
//         if (error) {
//             console.error('Error retrieving data from the database:', error);
//             return;
//         }

//         // Extract keywords using TF-IDF
//         const tfidf = new TfIdf();
//         rows.forEach((row) => {
//             const descriptionTokens = tokenizer.tokenize(row.product);
//             const addToDoc = descriptionTokens.join(' ');
//             tfidf.addDocument(addToDoc);
//         });

//         // Find relevant keywords based on TF-IDF scores
//         const relevantKeywords = [];
//         tfidf.listTerms(0).forEach((term) => {
//             relevantKeywords.push(term.term);
//         });

//         // Perform fuzzy matching with user input
//         const matches = stringSimilarity.findBestMatch(userInput, relevantKeywords);
//         console.log(matches)
//         const matchedKeywords = matches.ratings.filter((match) => match.rating > 0.5).map((match) => match.target);
//         if(matchedKeywords.length===0){
//             res.status(204).json([]);
//             return;
//         }
//         // Query the database for matching records
//         const searchQuery = `
//         SELECT * FROM products
//         WHERE product LIKE '%${matchedKeywords.join("%' OR product LIKE '%")}%' LIMIT 10
//       `;
//         db.query(searchQuery, (err, results) => {
//             if (err) {
//                 console.error('Error executing search query:', err);
//                 return;
//             }

//             // Process and display the search results
//             console.log('Search Results:');
//             results.forEach((result) => {
//                 console.log(result);
//             });
//             return res.status(200).json(results)
//         });
//     });
// }
