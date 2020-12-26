const docmodel = require("./../model/document");
const warehouse = require("./../model/warehouse");
const special = require("./special_chars");
const sw = require("./stopword");
const vector = require("./vector");

async function update_warehouse() {
  const documents = await docmodel.find();
  if (!documents) return;
  var sum = 0;
  var all_text = [];
  const ware = await warehouse.findOne();
  if (!ware) {
    var dt = new warehouse();

    for (let doc in documents) {
      var temp = special.clear_special_chars(documents[doc].content);
      temp = sw.filter_stopword(temp);
      dt.allText.push(temp);
      sum += 1;
    }
    dt.total = sum;
    dt.save();
  } else {
    ware.allText = [];
    for (let doc in documents) {
      var temp = special.clear_special_chars(documents[doc].content);
      temp = sw.filter_stopword(temp);
      ware.allText.push(temp);
      sum++;
    }
    data.total = sum;
    data.save();
  }

  for (let doc in documents) {
    var text = special.clear_special_chars(documents[doc].content);
    text = ("" + text).split(" ");
    text = sw.filter_stopword(text);
    var vec = vector.create_vector(text, all_text);
    // Update vector của document trong db
    for (let word in vec) {
      documents[doc].vector.direction.push(word);
      documents[doc].vector.value.push(vec[word]);
    }
    documents[doc].save();
  }
}

module.exports.update_warehouse = update_warehouse;
