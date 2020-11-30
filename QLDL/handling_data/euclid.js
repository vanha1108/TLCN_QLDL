module.exports.compute_distance = function (vecA, vecB) {
  // Đưa vecA và vecB về cùng số chiều
  for (let word in vecA) {
    if (vecB[word] == null) {
      vecB[word] = 0;
    }
  }
  for (let word in vecB) {
    if (vecA[word] == null) {
      vecA[word] = 0;
    }
  }

  // Tính khoảng cách Euclid
  let total = 0.0;
  for (let word in vecA) {
    total += Math.pow(vecA[word] - vecB[word], 2);
  }
  let distance = Math.sqrt(total);
  return distance;
};
