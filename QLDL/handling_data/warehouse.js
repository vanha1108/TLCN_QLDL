const docmodel = require("./../model/document");
const warehouse = require("./../model/warehouse");
const special = require("./special_chars");
const sw = require("./stopword");
const vector = require("./vector");
const documentController = require("./../controllers/document");

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
    ware.total = sum;
    await ware.save();
  }

  for (let doc in documents) {
    // Update vector của document trong db
    documents[doc].vector.direction = [];
    documents[doc].vector.value = [];
    const vec = await documentController.createVec(documents[doc].content);
    console.log(vec);
    for (let word in vec) {
      console.log(word);
      documents[doc].vector.direction.push(word);
      console.log(documents[doc].vector.direction);
      documents[doc].vector.value.push(vec[word]);
    }
    console.log(documents[doc].vector);
    await documents[doc].save();
  }
  console.log("Cronjob fishned!");
}

module.exports.update_warehouse = update_warehouse;
