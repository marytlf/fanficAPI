const http = require('http');
const bodyParser = require('body-parser');
const cheerio = require('cheerio');
const express = require('express');
const axios = require('axios');
const { send } = require('micro');
const url = require('url');
const request = require('request')
var querystring = require('querystring');
const curl = require('curlrequest');
var Regex = require("regex");

var lid;
var uid;
var ak;
var folder;
var position;
var action_key;
var has_session = true
var editing= 0
var is_new= 0
var seed = {}
var category = 'websites';

var i = 0, j = 0;
var regex = new RegExp("[a-zA-Z:]+");
var title, autor = [], keywords, ratings, tags, qtdFavorites = [], qtdComments, infos, synopsis = [], qtdViews, image = [], category;
var infos = [];
var stats = [];
var tagAux = [];
var infosRet = [];
var flagTitle = false
var flagTag = false
var itemss = [];
var datacut = [];

var listAux = []
 
var urlList = {url: ''};
 
var json = { url: "", urlList: "", title: "", tags: "", qtdComments: "", qtdFavorites: "", synopsis: "", qtdViews: "" , image:"", category: "", botMessage:""};
  
var colour;
var htmlBody;
var list = [];
var link = [];
const listRet = [];
var listSplit = [];
const relation = [];
var botMessage = ''
 
const shipLists = ['liam_dunbar_theo_raeken', 
'jeon_jungkook_min_yoongi_%7C_suga',
'kim_taehyung_%7C_v_min_yoongi_%7C_suga', 
'mark_tuan_jackson_wang',
'jung_hoseok_%7C_j-hope_min_yoongi_%7C_suga',
'park_jinyoung_mark_tuan',
'choi_youngjae_im_jaebum_%7C_jb',
'park_jinyoung_jackson_wang',
'jeon_jungkook_park_jimin',
'jeon_wonwoo_kim_mingyu',
'tin_can',
'nolan_brett_talbot']
 
 
const shipNames = ['Liam Dunbar/Theo Raeken', 
                'Jeon Jungkook/Min Yoongi | Suga', 
                'Kim Taehyung | V/Min Yoongi | Suga', 
                'Mark Tuan/Jackson Wang', 
                'Park Jinyoung/Mark Tuan', 
                'Jung Hoseok | J-Hope/Min Yoongi | Suga', 
                'Choi Youngjae/Im Jaebum | JB', 
                'Park Jinyoung/Jackson Wang',
                'Jeon Jungkook/Park Jimin' ,
                'Jeon Wonwoo/Kim Mingyu',
                'Can/Tin (Love By Chance)',
                'Nolan/Brett Talbot',
                'Tin/Can',
                'Park Jinyoung | Jr./Mark Tuan'
                ]
 
const hostname = '127.0.0.1';
const port = 3000;
 
 
var wait = ms => new Promise((r, j)=>setTimeout(r, ms))
 
 
         
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
 
    const { pathname } = url.parse(req.url);
    //console.log(pathname);  
    //console.log(req.url.split('?'))
    var urlFic = req.url.split('?');
    
 
    if (pathname === '/ao3'){
         
        console.log(urlFic[1])
        if (urlFic.length < 2){
            const body = {msg:'Missing url argument.'}
            res.writeHead(200, {
                'Content-Length': Buffer.byteLength(body),
                'Content-Type': 'application/json'
              })
              .end(body);
 
        }else {
            list.length = 0
            link.length = 0

            infos = []
            
            synopsis = []

            datacut = []

            autor = ''
            title = ''
            json.title = ''
            json.autor = ''
            json.urlList = ''
            json.qtdFavorites = ''
            json.qtdComments =''
            json.qtdViews = ''
            json.category = [''];
            json.image = 'ao3';
            json.tags = ''
            
            json.words = ''

            ao3(urlFic[1],res);
            //list.length = 0;
            //postFic();
            //formatList(list)
 
 
        }
         
    }
 
    if (pathname === '/getList'){
        if (urlFic.length < 2){
            const body = 'Missing url argument.';
            res.writeHead(200, {
                'Content-Length': Buffer.byteLength(body),
                'Content-Type': 'text/plain'
              })
              .end(body);
 
        }else {
            getList(urlFic[1],res);
             
        }
    }
 
 
});
 
 
function getShipLink(shipLists, shipTag) {
    console.log(shipTag)
    var ship = shipTag.trim()
     
    urlList = {url: ''};
 
    if(typeof shipTag !== 'undefined'){
        if (ship === 'Jeon Jungkook/Min Yoongi | Suga' || ship === 'Jeon Jeongguk | Jungkook/Min Yoongi | Suga'){
 
            urlList.url = "https://listography.com/chiibis/jeon_jungkook_min_yoongi_%7C_suga/1922417452"
            shipName = '1922417452'
            category = 'Jeon Jungkook/Min Yoongi | Suga'

            colour = 12
            return urlList.url;
        }else if (ship === 'Kim Taehyung | V/Min Yoongi | Suga'){
            urlList.url = "https://listography.com/chiibis/kim_taehyung_%7C_v_min_yoongi_%7C_suga/1385717433"
            //console.log(urlList)
            shipName = '1385717433'
            category = 'Kim Taehyung | V/Min Yoongi | Suga'
            colour = 1
            return urlList.url;
        }else if (ship === 'Jung Hoseok | J-Hope/Min Yoongi | Suga'){
            urlList.url = "https://listography.com/chiibis/jung_hoseok_%7C_j-hope_min_yoongi_%7C_suga/7606417459"
            //console.log(urlList)
            shipName = '7606417459'
            category = 'Jung Hoseok | J-Hope/Min Yoongi | Suga'
            colour = 17
            return urlList.url;
        }else if (ship === 'Liam Dunbar/Theo Raeken' || ship === 'Theo Raeken/Liam Dunbar'){
            urlList.url = "https://listography.com/chiibis/liam_dunbar_theo_raeken/4162414813"
            //console.log(urlList)
            shipName = '4162414813'
            category =  'Liam Dunbar/Theo Raeken'
            colour = 14
            return urlList.url;
        }else if (ship === 'Mark Tuan/Jackson Wang'){
            urlList.url = 'https://listography.com/chiibis/mark_tuan_jackson_wang/2660317433'
            //console.log(urlList)
            shipName = '2660317433'
            category = 'Mark Tuan/Jackson Wang'
            colour = 4
            return urlList.url;
        }else if (ship === 'Park Jinyoung/Mark Tuan' || ship === 'Park Jinyoung | Jr./Mark Tuan'){
            urlList.url = 'https://listography.com/chiibis/park_jinyoung_mark_tuan/6220014356'
            //console.log(urlList)
            shipName = '6220014356'
            category = 'Park Jinyoung/Mark Tuan'
            colour = 5
            return urlList.url;
        }else if (ship === 'Choi Youngjae/Im Jaebum | JB'){
            urlList.url = 'https://listography.com/chiibis/choi_youngjae_im_jaebum_%7C_jb/1465617569'
            shipName = '1465617569'
            category = 'Choi Youngjae/Im Jaebum | JB'
            //console.log(urlList)
            colour = 16
            return urlList.url;
        }else if (ship === 'Park Jinyoung/Jackson Wang'){
            urlList.url = 'https://listography.com/chiibis/park_jinyoung_jackson_wang/0306614872'
            //console.log(urlList)
            shipname = '0306614872'
            category = 'Park Jinyoung/Jackson Wang'

            colour = 7
            return urlList.url;
        }else if (ship === 'Jeon Jungkook/Park Jimin'){
            urlList.url = 'https://listography.com/chiibis/jeon_jungkook_park_jimin/0500514841'
            shipName = '0500514841'
            category = 'Jeon Jungkook/Park Jimin'
            //console.log(urlList)
            colour = 8
            return urlList.url;
        }else if (ship === 'Jeon Wonwoo/Kim Mingyu'){
            urlList.url = 'https://listography.com/chiibis/jeon_wonwoo_kim_mingyu/0542814841'
            //console.log(urlList)
            shipName = '0542814841'
            category = 'Jeon Wonwoo/Kim Mingyu'
            colour = 9
            return urlList.url;
        }else if (ship === 'Can/Tin (Love By Chance)' || ship === 'Tin/Can'){
            urlList.url = 'https://listography.com/chiibis/tin_can/7286017459'
            //console.log(urlList)
            shipName = '7286017459'
            category = 'Tin/Can'
            
            colour = 10
            return urlList.url;
        }else if (ship === 'Nolan/Brett Talbot'){
            urlList.url = 'https://listography.com/chiibis/nolan_brett_talbot/7366117459'
            shipName = '7366117459'
            category = 'Nolan/Brett Talbot'
            //console.log(urlList)
            colour = 11
            return urlList.url;
        }
 
 
    }
 
}


 
 
function formatList(list, newValue, linkNew, linkList,shipUrlList, title, autor,shipTag){
 
    //console.log("===="+list.length);
    var foundFlag = 1;
    var linkAux = []
    
     
    //console.log(">>>>>>> "+list[0])
    if ( list.length > 0){
        listSplit = list[0].split("\n")
         
       /*if (typeof listSplit != 'undefined'){
          for (j=1; j < listSplit.length-4 ; j++){
              console.log("value["+j+"]="+listSplit[j].trim());
          }
        }
        */



        var count = 0;
        if (typeof linkList != 'undefined'){
          for (j=1; j < linkList.length-2 ; j++){
              console.log("link["+j+"]="+linkList[j]+"\n");
              linkAux.push(linkList[j]);
              var resflag = linkList[j].toString().includes(linkNew)
                if(resflag === true){
                    foundFlag = 0
                    botMessage="Fic already exists:" + title
                    return botMessage;
                }
              count++
          }
        }

        var conc = title+' ('+autor+')';
        var count = 0;
        
        //console.log("conc= "+conc)
 

        for (i=2; i < listSplit.length-4 && foundFlag !== 0; i++){
         
            ////console.log("value"+i+"-"+listSplit[i].trim());
  
 
            if (listSplit[i] !== '' ){

                var resultFound = listSplit[i].toString().trim().includes(conc)
                
                if (resultFound === true){
                    botMessage="Fic already exists:" + listSplit[i]
                    foundFlag = 0
                    console.log(botMessage);
                    json.botMessage = botMessage
                    return botMessage
                }else{
                    var pos = listSplit[i].lastIndexOf('(')
                    if (pos > 2){
                        var titleAux = listSplit[i].substring(0,pos)
                        var autorAux = listSplit[i].substring(pos,listSplit[i].length)
                        //console.log("title inside formatTittle== "+titleAux+" and "+autorAux)
                        if(typeof titleAux !== 'undefined' && typeof autorAux !== 'undefined'){
                            listAux.push("* ("+titleAux.trim()+") "+"["+linkAux[count]+"] "+autorAux);
                            //console.log("LIST INSIDE FOR== "+listAux[count]);
                            //console.log("listAux="+listAux);
                            count++
                        }

                    }  
                }
                 
            }
        }
         
        //console.log(list.length+"<<<<<<<<<<<<");
        if (foundFlag !== 0){
            botMessage="Fic is posted.";
            //console.log(botMessage);

            var newItem = '* ('+title+')'+"["+linkNew+"] ("+autor+")";
            listAux.push(newItem)
            postFic(shipUrlList,shipTag,listAux)
           
            autor = ''
            title = ''
            listAux.length = 0
            flagTitle = false
            json.title = ''
            json.autor = ''
            json.botMessage = ''
            return botMessage
        }
         
    }
}
 
 

 
function getListContent(htmlBody, shipTag, shipUrlList, newValue,title, autor, linkNew) {
 
    const $ = cheerio.load(htmlBody);
    var idData = ''
    link.length = 0
    //console.log(htmlBody)
    $('.listbox-content').each(function(i,elem) {
         
        list[i] = $(this).text();
        //console.log("here"+list[i]+"\n")
    })
 
    $('a').each(function(j, elem) {
        var data = $(this);
        var aux = data.attr('href')
        //console.log(aux+"<<<==");
        var regex = new RegExp("https:.*|http:.*");
        //console.log(aux.search(regex))
        if (aux.search(regex) === 0){
            link.push(aux)
        }
    })
 
    $('[type="text/javascript"]').filter(function(){
        var data = $(this);
 
        //console.log(data+"<<<<var inside");
        idData = data
 
    });
 
    //console.log("newValue==="+newValue)
    //console.log("list==="+list)
    //list.push(newValue)
    //var aux = link.split(',');
    //console.log("======linkaaaaaaaaaaaa===="+aux[link.length-7].replace('/,/gi',"\n"))
    //console.log("======link===="+link.length);
 
     
    var regex = /ListView\(\{.*([\n\t\s]*|[0-9]|[a-zA-Z]|[ :{},''_"])*/gm;
    var regexNum = /[0-9]+/gm;
    var regexChar = /\'[0-9a-z]*\'/gm;
    var regexUpper = /[A-Z]/gm;
    var found = idData.toString().match(regex)
 
    if (found != null){
 
        var idList = found.toString().split('\n')
        uid= idList[0].trim().toString().match(regexNum)
        lid= idList[1].trim().toString().match(regexNum)
        //folder = idList[2].trim().toString(regexUpper)
        folder = 'M'
        position= idList[3].trim().toString(regexNum)
        action_key= idList[4].trim().toString().match(regexChar)
        seed=idList[8].trim().toString()
 
 
        var action_key_aux=action_key.toString().match(/[0-9a-z]*/gm)
        action_key = action_key_aux.toString().replace(/,/g,'')
        var pos = seed.lastIndexOf('}');
        seed = seed.substring(7,pos-1)
        formatList(list, newValue, linkNew, link,shipUrlList,title, autor, shipTag)
    }
return list;
}
 
 
async function getList(msg, shipTag, newValue, title, autor, linkNew, res) {
 
    var headers = {
        'authority': 'listography.com',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.80 Safari/537.36',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
        'referer': msg,
        'accept-language': 'en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7',
        'cookie': 'session-id=1235d5f213016b62c27e39c792880b806b1fa3bd00d8eb1839f13149f9dd5efe40b85'
    };
 
    var options = {
        url: msg ,
        method: 'GET',
        headers: headers
    };
 
    function callback(error, response, body) {
 
        if (!error && response.statusCode == 200) {
 
            htmlBody = body;
            //console.log("================="+body);
            console.log("LINK URL === "+msg)
 
            var ret = getListContent(htmlBody, shipTag, msg, newValue, title, autor,linkNew)
            return ret;
        }
 
    }
 
    request(options, callback);
 
}
 
 
 
 
async function postFic(shipListListography, shipName, dataContent) {
 
 
    var headers = {
        'cookie': 'session-id=1235d5f213016b62c27e39c792880b806b1fa3bd00d8eb1839f13149f9dd5efe40b85',
        'origin': 'https://listography.com',
        'content-encoding': 'gzip',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'accept': 'text/javascript, text/html, application/xml,application/json,text/json text/xml, */*',
        'authority': 'listography.com',
        'x-requested-with': 'XMLHttpRequest',
        'referer': shipListListography
    };
 
 
    var listConc = dataContent.join('\n')
 
    if (category !== 'websites'){
        shipName = ''
    }

    var dataPost = {
        'ak': action_key,
        'uid': uid,
        'lid': lid,
        'category': category,
        'new_category':'',
        'title': shipName,
        'content': listConc,
        'seed': seed,
        'color_number': colour,
        'font': 'Helvetica',
        'style': 'Number',
        'folder': 'M',
        'editing': 1,
        'effective_category': category,
        '_':''
    }
 
 
    var dataString = querystring.encode(dataPost)
 
    var options = {
        'url': 'https://listography.com/action/save-list-in-place',
        'method': 'POST',
        'headers': headers,
        'body': dataString
    };
 
    function callback(error, response, body) {
        console.log("RESPONSE"+response.statusCode);
         
        if (!error && response.statusCode == 200) {
            console.log("ok");
        }
    }
 
    request(options, callback);
 
 
}
 
 
async function ao3(msg, respond) {
 
       
        infos = []
        tagAux = []
        synopsis = []
        infosRet = []

        tags = ''
        autor = ''
        title = ''
        json.title = ''
        json.autor = ''
        json.urlList = ''
        json.qtdFavorites = ''
        json.qtdComments =''
        json.qtdViews = ''
        json.category = [''];
        json.image = 'ao3';
        json.tags = ''
        
        json.words = ''

        var concItem = ''
        flagTitle = false
        flagTag = false


        axios.get(msg)
            .then((response) => {
                tags = ''
                autor = ''
                title = ''
                json.title = ''
                json.autor = ''
                json.urlList = ''

                if (response.status === 200) {
                     
                    const html = response.data;
                    const $ = cheerio.load(html);
                     
                    //console.log(html)
                      $('.title.heading').filter(function () { //autor
                        var data = $(this);
                        //console.log(data.text())
                        title = data.text().trim('\n');
                        //console.log("first title="+title)
                        flagTitle = true
                        //var StrippedString = autor.replace(/(<([^>]+)>)/ig,"").replace(/^\s*\n/gm,"").replace(/(^\s+|\s+$)/g, "");
 
                        //infos.push(StrippedString.split('\n'));
                         
                        //console.log(infos)
                        //infosRet = infos[0]
                        //infos.forEach(function(entry) {
                        //  entry = (entry.replace(/(^\s+|\s+$)/g, ""));
                                 
                        //});
                        //console.log("aqui3")
                        //title = infosRet[0];
                        //console.log(title+"============="+infosRet)
                        //autor = infosRet[2].replace(/^\s*\n/gm,"");
                        //console.log("aquiiiiiiiiiiiiiii 4")
                         
                    })
 
                    $('.heading').filter(function () { 
 
                        if(typeof title === 'undefined' || flagTitle === false){
                            var data = $(this);
                            //console.log(data.text())
                            title = data.text().trim('\n');
                            //console.log(title)
                            var StrippedString = title.replace(/(<([^>]+)>)/ig,"").replace(/^\s*\n/gm,"").replace(/(^\s+|\s+$)/g, "");
 
                            infos.push(StrippedString.split('\n'));
                             
                            //console.log(infos)
 
                            infosRet.push(infos);
 
                            if (infosRet.length > 2){
                                var aux = infosRet[2];
                                var aux_aux = aux[2]
                                 
                                title = aux_aux[0].replace(/^\s*\n/gm,"");;
                                autor = aux_aux[2].replace(/^\s*\n/gm,"");
                            }
                        }
 
                         
                         
                    })
 
                    $('.summary.module').filter(function(){
                        var data = $(this);
                        synopsis = data.text();
                        //console.log(synopsis[0].replace(/^\s*\n/gm,""))
                        //console.log("=========="+synopsis)
                         
                    })
 
                    $('.userstuff.summary').filter(function(){
                        var data = $(this);
                        if (typeof synopsis === 'undefined' || synopsis.length < 1){
                            synopsis.push(data.children().text());
                        }
                         
                        //console.log(synopsis[0].replace(/^\s*\n/gm,""))
                         
                         
                    })
 
 
                    $('.byline.heading').filter(function(){
                        var data = $(this);
                        if (typeof autor === 'undefined' || autor.length < 1){
                            autor = data.text();
                        }
                         
                    })
 
                    $('li').filter(function() {
 
                            var data = $(this)
                                 
                            datacut.push(data.text())
                            //console.log(datacut)
 
                            //console.log(datacut.length)  
                             
                            if (datacut.length > 40 && datacut.length < 60){
                                for (i = 0 ; i < shipNames.length && flagTag === false; i++){
                                    if (shipNames[i] === datacut[datacut.length-1]){
                                        console.log("The ship is == " + datacut[datacut.length-1])
                                        tagAux[0]=datacut[datacut.length-1]
                                        tagAux[1]=datacut[datacut.length-1]
                                        tags = datacut[datacut.length-1]
                                        flagTag = true
                                    }
                                }
                             
                            }
                             
                            //console.log("===========>" + datacut.length)
                             
                           
                    })
                 
 
                    $('.relationship').filter(function(){
                     
 
                        if (typeof tags === 'undefined' || tags.length < 2 || flagTag === false){
                            var data = $(this)
                            tags = data.text()
                            //var regexName = new RegExp(/^\s*\n*\t*/gm,"")
 
                            tagAux = tags.split()
 
                            if (tagAux.length > 1){
                                tagAux[0] = tagAux[1].replace(/^\n*/gm,"")
                                 
                            }
                        }
                         
                         
                    })
                     
                     
                     
                    $('.relationships').filter(function(){
                         
                        var data = $(this)
                        if(typeof tags === 'undefined' || tags.length < 2 || flagTag === false){
                            tags = data.text()
                           tagAux[0]=tags
                        } 
 
                         
                    })
                     
 
 
                    $('.stats').filter(function(){
                        var data = $(this);
                        qtdFavorites = data.text().trim('\n');
                         
                        stats = qtdFavorites.split(regex)
                    })
 
                  
                     
                    json.title = title;
                    json.autor = autor;
                    json.synopsis = synopsis
                    json.qtdFavorites = stats[6]; //Favoritos
                    json.qtdComments = stats[5]; //coments;
                    json.qtdViews = stats[8]
                    json.category = [''];
                    json.image = 'ao3';
                    json.tags = tagAux[0];
                    json.url = msg;
                    json.words = stats[3]
 
                    json.urlList = ''
                     
                    var retValue = getShipLink(shipLists,tagAux[0]); //
                     
                    json.urlList = retValue
 
 
                    var concItem = '* ('+json.title+') ['+json.url+'] ('+json.autor.trim()+')'
                    //console.log("concItem====="+concItem)
 
                    const listBody = getList(json.urlList,json.tags,concItem,json.title,json.autor.trim(),json.url)
                    //formatList(list)
                    var prom = wait(4000)  // prom, is a promise
                    var showdone = ()=>console.warn('done')
                    prom.then(showdone)
 
                    json.botMessage = botMessage;
                     
                    console.log(json);
 
                    const body = json;
                    respond.end(JSON.stringify(body));
 
                    infos = []
                    
                    synopsis = []

                    datacut = []

                    autor = ''
                    title = ''
                    json.title = ''
                    json.autor = ''
                    json.urlList = ''
                    json.qtdFavorites = ''
                    json.qtdComments =''
                    json.qtdViews = ''
                    json.category = [''];
                    json.image = 'ao3';
                    json.tags = ''
                    
                    json.words = ''
                   
                    //postFic(json.urlList,json.tags,list)  
 
                }
            
 
            }, (error) => console.log(error));
 
 
}
 
 
 
 
 
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});      
