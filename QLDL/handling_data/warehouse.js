const docmodel = require("./../model/document");
const warehouse = require("./../model/warehouse");
const special = require("./special_chars");
const sw = require("./stopword");

function update_warehouse() {
  var all_text = [];
  var sum = 0;

  docmodel.find({}).exec(function (err, res) {
    if (err) console.log(err);
    if (!res) console.log("Not find document!");
    else {
      for (let doc in res) {
        var temp = special.clear_special_chars(res[doc].data);
        temp = sw.filter_stopword(temp);
        all_text.push(temp);
        sum += 1;
      }

      warehouse.findOne({}).exec(function (err, data) {
        if (err) console.log(err);
        if (!data) {
          var temp = {
            total: sum,
            allText: all_text,
          };
          var data = new warehouse(temp);
          data.save();
        } else {
          data.total = sum;
          data.allText = all_text;
          data.save();
        }
      });
    }
  });
}

module.exports.update_warehouse = update_warehouse;
