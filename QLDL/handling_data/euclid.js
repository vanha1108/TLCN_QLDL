module.exports.compute_distance = function (vecA, vecB) {
  var vec1 = [];
  var vec2 = [];

  // Sao chép 2 vector
  for (let word in vecA) {
    vec1[word] = vecA[word];
  }
  for (let word in vecB) {
    vec2[word] = vecB[word];
  }
  // Đưa vecA và vecB về cùng số chiều
  for (let word in vec1) {
    if (vec2[word] != Number) {
      vec2[word] = 0;
    }
  }
  for (let word in vec2) {
    if (vec1[word] != Number) {
      vec1[word] = 0;
    }
  }

  // Tính khoảng cách Euclid
  let total = 0.0;
  for (let word in vec1) {
    total += Math.pow(vec1[word] - vec2[word], 2);
  }
  let distance = Math.sqrt(total);
  return distance;
};
