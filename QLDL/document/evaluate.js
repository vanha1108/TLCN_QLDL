var docmodel = require("./../model/document");
module.exports.evalution_similarity = function (result) {
  return new Promise(function (resolve, reject) {
    var arrResult = [];
    var d;
    for (let doc in result) {
      docmodel.findOne({ _id: doc }).exec(function (err, data) {
        if (result[doc] <= 0) {
          d = {
            document: data,
            message: "Perfect",
          };
          arrResult.push(d);
        } else {
          if (result[doc] < 0.01) {
            d = {
              document: data,
              message: "Perfect",
            };
            arrResult.push(d);
          } else {
            if (result[doc] < 0.03) {
              d = {
                document: data,
                message: "Perfect",
              };
              arrResult.push(d);
            } else {
              d = {
                document: data,
                message: "Perfect",
              };
              arrResult.push(d);
            }
          }
        }
      });
    }

    resolve(arrResult);
  });
};
