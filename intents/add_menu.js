exports.intent_name = 'add_menu';

var prefixs = ["เพิ่มเมนูใหม่สำเร็จ #เชฟบิ๊กเมนู", "เหล้าไม่ใช่คำตอบ แต่มันช่วยให้ลืมคำถาม #เชฟบิ๊กเมนู", "ขอขอบคุณความรักที่เป็นกำลังใจในการสร้างสรรเมนู #เชฟบิ๊กเมนู", "กินมันติดเหงือก กินเผือกติดฟัน #เชฟบิ๊กเมนู",
    "ข้าวผัดหมูใส่ไข่ ให้พลังงาน 557 กิโลแคลอรี่  #เชฟบิ๊กเมนู ที่มา: http://health.kapook.com/view58233.html",
    "พิซซ่าถาดกลางให้พลังงาน 876 กิโลแคลอรี่  #เชฟบิ๊กเมนู ที่มา: http://health.kapook.com/view58233.html",
    "กาแฟเย็นหนึ่งแก้วให้พลังงาน 115 กิโลแคลอรี่  หรือเท่ากับการวิ่ง 1.8 กิโล #เชฟบิ๊กเมนู ที่มา: http://health.kapook.com/view58233.html",
    "#เชฟบิ๊กเมนู http://f.ptcdn.info/972/005/000/1370662215-9347685366-o.jpg", "#เชฟบิ๊กเมนู http://f.ptcdn.info/567/009/000/1378877401-1371387329-o.jpg"
];

exports.respond = function (bot, message, db, entities) {
    "use strict";
    var menu_name = entities.foodname[0].value;
    console.log("Adding..." + menu_name + " to menus collection.");
    db.collection('menus').insert({
        name: menu_name
    }, function (err, result) {
        if (err) {
            console.log(err);
            bot.reply(message, 'Umm...I cannot stand (to add) this menu');
        } else {
            console.log(result);
            console.log("Inserted " + menu_name + " into the menus collection");
            bot.reply(message, "Added " + menu_name);
            bot.reply(message, prefixs[Math.floor(Math.random() * prefixs.length)]);
        }
    });

    // db.collection('menus').find({}).toArray(function(err, docs) {
    //     if (err) {
    //         console.log(err);
    //         bot.reply(message, 'Umm...I cannot stand this menu');
    //     } else {
    //         bot.reply(message, prefixs[Math.floor(Math.random()*prefixs.length)]);
    //     }
    // });
};