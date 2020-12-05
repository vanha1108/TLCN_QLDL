var special = require("./special_chars");

var readfile = require("./../document/readfile");

async function testSpecial() {
  var content = await readfile.readFiletxt(
    "D:/nodejs/QLDL/public/uploads/ex.txt"
  );

  special.clear_special_chars(content).then(function (kq, err) {
    console.log(kq);
  });
}

testSpecial();
