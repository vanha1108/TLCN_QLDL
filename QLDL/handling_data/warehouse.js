const docmodel = require("./../model/document");
const warehouse = require("./../model/warehouse");
const special = require("./special_chars");
const sw = require("./stopword");
const vector = require("./vector");

function update_warehouse() {
  docmodel.find({}).exec(function (err, docs) {
    if (err) console.log(err);
    if (docs[0] == null) {
      console.log("Not find document!");
      return;
    } else {
      var sum = 0;
      var all_text = [];

      warehouse.findOne({}).exec(function (err, data) {
        if (err) console.log(err);
        if (!data) {
          var dt = new warehouse();

          for (let doc in docs) {
            var temp = special.clear_special_chars(docs[doc].data);
            temp = sw.filter_stopword(temp);
            dt.allText.push(temp);
            sum += 1;
          }
          dt.total = sum;
          dt.save();
        } else {
          data.allText = [];
          for (let doc in docs) {
            var temp = special.clear_special_chars(docs[doc].data);
            temp = sw.filter_stopword(temp);
            data.allText.push(temp);
            sum++;
          }
          data.total = sum;
          data.save();
        }
      });

      // Update lại từng document (vector)
      var all_text = [];
      warehouse.findOne({}).exec(function (err, data) {
        if (data) {
          for (let doc in data.allText) {
            all_text.push(data.allText[doc]);
          }
        }
      });

      for (let doc in docs) {
        var text = special.clear_special_chars(docs[doc].content);
        text = ("" + text).split(" ");
        text = sw.filter_stopword(text);
        var vec = vector.create_vector(text, all_text);
        // Update vector của document trong db
        for (let word in vec) {
          docs[doc].vector.direction.push(word);
          docs[doc].vector.value.push(vec[word]);
        }
        docs[doc].save();
      }
    }
  });
  console.log("Cron Job Finished");
}

module.exports.update_warehouse = update_warehouse;
