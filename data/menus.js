var menus = [
    {
        "id": 1,
        "name": "กระเพราไก่ไข่ดาว"
    },
    {
        "id": 2,
        "name": "ข้าวหมูทอด"
    }
];

var prefixs = ["How about ","Have you try "];

exports.givemefood = function () {
    return prefixs[Math.floor(Math.random()*prefixs.length)] + menus[Math.floor(Math.random()*menus.length)].name + "?";
};