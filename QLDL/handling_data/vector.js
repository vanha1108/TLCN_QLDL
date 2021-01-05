var tfidf = require("./compute_TFIDF");

module.exports.create_vector = function (text, all_text) {
  let word_arr = [];
  let tfidf_Dict = tfidf.TF_IDF(text, all_text);
  for (let word in tfidf_Dict) {
    if (tfidf_Dict[word] > process.env.TFIDF_FILTER) {
      word_arr[word] = tfidf_Dict[word];
    }
  }
  return word_arr;
};
