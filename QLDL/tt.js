var tf = require("./handling_data/compute_TFIDF");

let text = "Tôi yêu em ấy";
let all = ["Tôi yêu em ấy", "Tôi thương em ấy"];
let x = tf.TF_IDF(text, all);
