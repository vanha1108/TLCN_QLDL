var tfidf = require("./compute_TFIDF");

module.exports.create_vector = function (text, all_text) {
  let tfidf_Dict;
  let total = 0;
  let N = 0;
  let word_arr = [];
  tfidf_Dict = tfidf.TF_IDF(text, all_text);

  for (let word in tfidf_Dict) {
    N += 1;
    total += tfidf_Dict[word];
  }
  let AVG = total / N;

  for (let word in tfidf_Dict) {
    if (tfidf_Dict[word] > AVG) {
      word_arr[word] = tfidf_Dict[word];
    }
  }

  return word_arr;
};
