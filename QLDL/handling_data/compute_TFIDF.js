const special_chars = require("./special_chars");

module.exports.TF_IDF = function (text, all_text) {
  let appearDict = compute_appear(text);
  let wordCount = word_count(text);
  let tfDict = tf(appearDict, wordCount);

  let arrDoc = arr_doc(all_text);
  let dictContain = contain_word(text, arrDoc);
  let total_doc = all_text.length;

  let idfDict = idf(dictContain, total_doc);

  let tfidf = {};
  for (let word in tfDict) {
    tfidf[word] = tfDict[word] * idfDict[word];
  }
  return tfidf;
};

function tf(appearDict, wordCount) {
  let tfDict = {};
  for (let word in appearDict) {
    tfDict[word] = appearDict[word] / wordCount;
  }
  return tfDict;
}

function idf(dict_contain, total_doc) {
  let idfDict = {};
  let temp;
  for (let word in dict_contain) {
    temp = total_doc / dict_contain[word];
    idfDict[word] = Math.log2(1 + temp);
  }

  return idfDict;
}

function word_count(text) {
  let bow = special_chars.clear_special_chars(text).split(" ");
  return bow.length;
}

/*
  compute_appear tính số lần xuất hiện của từ t trong văn bản d
*/
function compute_appear(text) {
  let appearDict = {};
  text = special_chars.clear_special_chars(text);
  let bow = text.split(" ");

  for (let word in bow) {
    appearDict[bow[word]] = 0;
  }

  for (let word in bow) {
    appearDict[bow[word]] += 1;
  }
  return appearDict;
}

/*
    Trả ra số lần xuất hiện của các từ trong tập văn bản lớn D
    dict_contain = { 'tôi': 1, 'yêu': 0, em: 1, 'ấy': 1 }
*/
function contain_word(text, arr_doc) {
  text = special_chars.clear_special_chars(text);
  let bow = text.split(" ");
  let dict_contain = {};
  for (let word in bow) {
    dict_contain[bow[word]] = 0;
  }
  for (let doc in arr_doc) {
    for (let word in arr_doc[doc]) {
      if (arr_doc[doc][word] > 0) {
        if (dict_contain[word] != null) {
          dict_contain[word] += 1;
        }
      }
    }
  }
  return dict_contain;
}

function word_count(text) {
  let bow = special_chars.clear_special_chars(text).split(" ");
  return bow.length;
}

/* 
    Trả ra một mảng chứa các list từ được phân tách từ text_list là tất cả dữ liệu text trong db
      arr_doc = [
        { 'tôi': 1, 'yêu': 1, em: 1, 'ấy': 1 },
        { 'tôi': 1, 'thương': 1, em: 1, 'ấy': 1 }
      ]
*/
function arr_doc(text_list) {
  let arr_doc = [];
  let doc_list = {};
  let temp = {};
  for (let doc in text_list) {
    temp = special_chars.clear_special_chars(text_list[doc]).split(" ");
    for (let word in temp) {
      doc_list[temp[word]] = 1;
    }
    arr_doc.push(doc_list);
    doc_list = {};
  }
  return arr_doc;
}
