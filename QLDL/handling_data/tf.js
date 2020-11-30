var compute = require("./compute_TFIDF");
var vector = require("./vector");
var euclid = require("./euclid");

let all_text = ["Tôi yêu em ấy", "Tôi thương em ấy"];
let text = "Tôi yêu em ấy";

let vecA = vector.create_vector(text, all_text);
let vecB = vector.create_vector("Tôi thương em ấy", all_text);

var x = euclid.compute_distance(vecA, vecB);
console.log(x);
