/**
 * Created by Bianrongcheng on 2018
 */
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 8080 });
var iconv = require('iconv-lite');

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

    var fs = require("fs");
    //path模块，可以生产相对和绝对路径
    var path = require("path");
    //配置远程路径
    var remotePath = "/";
    //获取当前目录绝对路径，这里resolve()不传入参数
    var filePath = path.resolve("测试文件");
    //读取文件存储数组
    var fileArr = [];
    //读取文件目录
    fs.readdir(filePath,function(err,files){
        if(err){
            console.log(err);
            return;
        }
        var count = files.length;
        //console.log(files);
        var results = {};
        files.forEach(function(filename){
            //filePath+"/"+filename不能用/直接连接，Unix系统是”/“，Windows系统是”\“
            fs.stat(path.join(filePath,filename),function(err, stats){
                if (err) throw err;
                //文件
                if(stats.isFile()){
                    if(getdir(filename) == 'txt'){
                        var newUrl=remotePath+filename;
                        fileArr.push(newUrl);
                        writeFile(fileArr);
                    }
                    // (getdir(filename) == 'html')&&(fileArr.push(filename);writeFile(newUrl));
                    //  console.log("%s is file", filename);
                }else if(stats.isDirectory()){
                    // console.log("%s is a directory文件目录", filename);
                    //返回指定文件名的扩展名称
                    //console.log(path.extname("pp/index.html"));
                    if(filename == 'css' || filename == 'images'){
                        //var readurl = filePath+'/'+filename;
                        //filePath+"/"+filename不能用/直接连接，Unix系统是”/“，Windows系统是”\“
                        //  console.log(path.join(filePath,filename));
                        var name = filename;
                        readFile(path.join(filePath,filename),name);
                    }
                }
            });
        });
    });
    //获取后缀名
    function getdir(url){
        var arr = url.split('.');
        var len = arr.length;
        return arr[len-1];
    }
    //获取文件数组
    function readFile(readurl,name){
        console.log(name);
        var name = name;
        fs.readdir(readurl,function(err,files){
            if(err){console.log(err);return;}
            files.forEach(function(filename){
                // console.log(path.join(readurl,filename));
                fs.stat(path.join(readurl,filename),function(err, stats){
                    if (err) throw err;
                    //是文件
                    if(stats.isFile()){
                        var newUrl=remotePath+name+'/'+filename;
                        fileArr.push(newUrl);
                        writeFile(fileArr)
                        //是子目录
                    }else if(stats.isDirectory()){
                        var dirName = filename;
                        readFile(path.join(readurl,filename),name+'/'+dirName);
                        //利用arguments.callee(path.join())这种形式利用自身函数，会报错
                        //arguments.callee(path.join(readurl,filename),name+'/'+dirName);
                    }
                });
            });
        });
    }
    // 写入到filelisttxt文件
    function writeFile(data){
        var data = data.join(',');
        fs.writeFile("filelist.txt",data+',',function(err){
            if(err) throw err;
            // console.log(data)
            // console.log("写入成功");
        });
    }

    // fs.readFile('filelist.txt', 'utf8', function(err, data){
    //     console.log(data);
    // });

    var data = fs.readFileSync('filelist.txt', 'utf8');
    // console.log(typeof data);
    // data   =   data.replace(/\s+/g,"");
    var arr = [];

    arr.push(data);

    // console.log(arr);

    var demo =JSON.stringify(arr);
    // var sd = JSON.parse()

    var a =demo.replace(/\"/g, "");
    var z =a.replace(/\[/g, "");
    var x =z.replace(/\]/g, "");
    var c = x.slice(-2,-1);
    var bc = x.split(",");
    // console.log(bc[1]);

    for(var i=0;i<bc.length-1;i++){
        var url ='测试文件'+bc[i]+'';
        // console.log('\''+url+'\'');

        fs.readFile(''+url+'',function(error,date){    //读取文件，回调函数第一个参数表示错误信息，第二个参数为读取的文本内容

            if(error){

                console.log(error);

            }else if(date[0]==0xff&&date[1]==0xfe){

                var res = iconv.decode(date,  'gbk');
                ws.send(res);
                console.log(11111);

            }else if(date[0]==0xfe&&date[1]==0xff){

                var res = iconv.decode(date,  'gbk');
                ws.send(res);

                console.log(222222);

            }else if(date[0]==0xef&&date[1]==0xbb){

                var res = iconv.decode(date,  'utf8');
                ws.send(res);

                console.log(3333333);
                13121883339

            }else{

                var res = iconv.decode(date,  'gbk');
                ws.send(res);

                console.log(444444);

            }

        });


      /*  var texts = fs.readFileSync(url);
        // console.log(texts)
        var res = iconv.decode(texts, 'gbk');
        // console.log(res);
        ws.send(res)*/
    }
});