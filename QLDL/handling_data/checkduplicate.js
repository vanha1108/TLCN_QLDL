const { text } = require("express");
var euclide = require("./euclid");
var vector = require("./vector");
var special = require("./special_chars");

module.exports.check_duplicate = async function (vecA, vecB) {
  return new Promise(async function (resolve, reject) {
    // textA = await special.clear_special_chars(textA);
    // textB = await special.clear_special_chars(textB);

    // var all_text = [];
    // all_text.push(textA);
    // all_text.push(textB);

    // var vectorA = await vector.create_vector(textA, all_text);

    // var vectorB = await vector.create_vector(textB, all_text);

    var distance = await euclide.compute_distance(vectorA, vectorB);
    resolve(distance);
  });
};