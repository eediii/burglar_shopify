const cheerio = require("cheerio");
const express = require("express");
const fetch = require("node-fetch");
const slugify = require("slugify");
const cors = require("cors");

API_URI_1 = "https://www.hurriyet.com.tr/mahmure/astroloji/{0}-burcu/" //burada günlük yorumları
API_URI_2 = "https://www.hurriyet.com.tr/mahmure/astroloji/{0}-burcu-{1}-yorum/" // burada get değerine göre burcun haftalık,aylık,yıllık yorumunu alacağız
API_URI_3 = "https://www.hurriyet.com.tr/mahmure/astroloji/burclar/{0}-burcu/{1}"
// gelecek degerler => AŞK,KARİYER,OLUMLU YONLER,SAĞLIK,STİL,ÜNLÜLER,DİYET,ZIT BURÇLARI,EĞLENCE HAYATİ, MAKYAJ, SAÇ STİLİ, ŞİFALI BİTKİLER, FİLM ÖNERİLERİ, ÇOCUKLUĞU, KADINI, ERKEĞİ

const app = express();
app.use(cors({ origin: 'https://4c5ca1-54.myshopify.com' }));

//Gunluk /get/burc

app.get("/get/:burc", async (req, res) => {
    const burc = req.params.burc;
    const datas = [];

    await fetch(API_URI_1.replace('{0}', slugify(burc)))
        .then(response => response.text())
        .then(body => {
            const $ = cheerio.load(body);
            const motto = $('body > div.main-wrapper > div:nth-child(2) > div > div > div.region-type-1.col-12 > div.row.mb20 > div > div > div.horoscope-menu-detail > ul > li:nth-child(1)').text.split(":  ")[1];
            const gezegen = $('body > div.main-wrapper > div:nth-child(2) > div > div > div.region-type-1.col-12 > div.row.mb20 > div > div > div.horoscope-menu-detail > ul > li:nth-child(2)').text.split(":  ")[1];
            const element = $('body > div.main-wrapper > div:nth-child(2) > div > div > div.region-type-1.col-12 > div.row.mb20 > div > div > div.horoscope-menu-detail > ul > li:nth-child(3)').text.split(":  ")[1];
            const yorum = $('body > div.main-wrapper > div:nth-child(2) > div > div > div.region-type-2.col-lg-8.col-md-12 > div > div.horoscope-detail-tab > div.horoscope-detail-content > div > p:nth-child(2)').text();
            
            if (baslik || motto || gezegen || element || yorum) {
                datas.push({
                    Burc: burc.charAt(0).toUpperCase() + burc.slice(1),
                    Motto: motto.trim(),
                    Gezegen:gezegen.trim(),
                    Element:element.trim(), 
                    Yorum: yorum.trim(),
                });
            }
        })
        .catch(error => {
            console.error("Hata oluştu:", error);
            res.status(500).send({ error: "Veri çekilirken hata oluştu." });
        });
    if (datas.length === 0) {
        res.status(404).send({ error: "Veri bulunamadı." });
    } else {
        res.send(datas);
    }
});

//haftalik,aylik,yillik burc yorumları örnek olarak => .../get/aslan/haftalik
//gunluk yorum için herhangi bir değere gerek yoktur => /get/burc yeterlidir

app.get("/get/:burc/:zaman", async (req, res) => {
    const burc = req.params.burc;
    const zaman = req.params.zaman;
    const datas = [];

    await fetch(API_URI_2.replace('{0}', slugify(burc)).replace('{1}', slugify(zaman)))
        .then(response => response.text())
        .then(body => {
            const $ = cheerio.load(body);
            const motto = $('body > div.main-wrapper > div:nth-child(2) > div > div > div.region-type-1.col-12 > div.row.mb20 > div > div > div.horoscope-menu-detail > ul > li:nth-child(1)').text.split(":  ")[1];
            const gezegen = $('body > div.main-wrapper > div:nth-child(2) > div > div > div.region-type-1.col-12 > div.row.mb20 > div > div > div.horoscope-menu-detail > ul > li:nth-child(2)').text.split(":  ")[1];
            const element = $('body > div.main-wrapper > div:nth-child(2) > div > div > div.region-type-1.col-12 > div.row.mb20 > div > div > div.horoscope-menu-detail > ul > li:nth-child(3)').text.split(":  ")[1];
            const yorum = $('body > div.page-wrapper.news-detail-page.Article > section.news-detail-content > div.container > div:nth-child(5) > div.col-xl-17.col-lg-16.news-left-content > div.news-content.readingTime > p').text();
            
            if (baslik || motto || gezegen || element || yorum) {
                datas.push({
                    Burc: burc.charAt(0).toUpperCase() + burc.slice(1),
                    Zaman: zaman.charAt(0).toUpperCase() + zaman.slice(1),
                    Motto: motto.trim(),
                    Gezegen:gezegen.trim(),
                    Element:element.trim(), 
                    Yorum: yorum.trim(),
                });
            }
        })
        .catch(error => {
            console.error("Hata oluştu:", error);
            res.status(500).send({ error: "Veri çekilirken hata oluştu." });
        });
    if (datas.length === 0) {
        res.status(404).send({ error: "Veri bulunamadı." });
    } else {
        res.send(datas);
    }
});

// Özeliklere Göre
// /gets/burc/ozellik => Dikkat etmemiz gereken nokta burada GET değil GETS kullandık
// gelecek degerler => AŞK,KARİYER,OLUMLU YONLER,SAĞLIK,STİL,ÜNLÜLER,DİYET,ZIT BURÇLARI,EĞLENCE HAYATİ, MAKYAJ, SAÇ STİLİ, ŞİFALI BİTKİLERi, FİLM ÖNERİLERİ, ÇOCUKLUĞU, KADINI, ERKEĞİ

app.get("/gets/:burc/:ozellik", async (req, res) => {
    const burc = req.params.burc;
    const ozellik = req.params.ozellik;
    const datas = [];

    await fetch(API_URI_3.replace('{0}', slugify(burc)).replace('{1}', slugify(ozellik)))
        .then(response => response.text())
        .then(body => {
            const $ = cheerio.load(body);
            const baslik = $('body > div.page-wrapper.news-detail-page.Article > section.news-detail-content > div.container > div:nth-child(5) > div.col-xl-17.col-lg-16.news-left-content > div.news-content__inf > h2').text();
            const yorum = $('body > div.page-wrapper.news-detail-page.Article > section.news-detail-content > div.container > div:nth-child(5) > div.col-xl-17.col-lg-16.news-left-content > div.news-content.readingTime > p').text();
            if (baslik || yorum) {
                datas.push({
                    Burc: burc.charAt(0).toUpperCase() + burc.slice(1),
                    Ozellik: ozellik.charAt(0).toUpperCase() + ozellik.slice(1),
                    Baslik: baslik.trim(),
                    Yorum: yorum.trim(),
                });
            }
        })
        .catch(error => {
            console.error("Hata oluştu:", error);
            res.status(500).send({ error: "Veri çekilirken hata oluştu." });
        });
    if (datas.length === 0) {
        res.status(404).send({ error: "Veri bulunamadı." });
    } else {
        res.send(datas);
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("Sunucu ayakta")
})
