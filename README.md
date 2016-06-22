#GAX : Glory Asynchronous XmlHttpRequest
***
通用Ajax，支持链式调用，跨域，POST和GET，内嵌Fetch API支持。
###基本方法 Basic Method

#####构造方法 Gax(url)
> url : 请求的地址

> 此方法返回一个Gax对象。

```javascript
Gax("http://iwenku.net");
```
***
#####配置设置 set(key,value)
> key ：要设置配置选项的键

> value : 要设置配置选项的值

> 此方法返回一个Gax对象。

> 默认配置 ：返回内容类型（type），可设置为json、xml；超时时间（timeout），默认为0即没有超时；超时回调函数（ontimeout），默认为空函数；跨域方法（com），默认为jsonp，需要在服务器生成的内容中调用GaxJsonp方法。
```javascript
Gax("http://iwenku.net").set("type","json");
```
***
#####HTTP头信息设置 header(key,value)
> key ：要设置的头

> value : 要设置的头内容

> 此方法返回一个Gax对象。

```javascript
Gax("http://iwenku.net").set("type","json").header("COntent-Type","application/x-www-form-urlencoded");
```
***
#####GET请求方法 get(dataObject)
>dataObject是一个对象，是要传向目标URL的内容。

> 此方法返回一个Gax对象。

```javascript
Gax("http://iwenku.net").set("type","json").header("COntent-Type","application/x-www-form-urlencoded").get({name:"gax"});
```
***
#####POST请求方法 post(dataObject)
>dataObject是一个对象，是要传向目标URL的内容。

> 此方法返回一个Gax对象。

```javascript
Gax("http://iwenku.net").post({name:"gax"});
```
***
#####成功回调函数 success(callback(data[,args]))
>callback是一个函数，当请求成功时会将返回的数据根据配置中的type来进行处理，然后传入callback。

>args中存储着耗时等信息。

> 此方法返回一个Gax对象。

```javascript
Gax("http://iwenku.net").get().success(function(data){
	console.log(data);
});
```
***
#####失败回调函数 error(callback(args))
>callback是一个函数，在请求失败时执行，args中存储着失败的原因，耗时等信息。

> 此方法返回一个Gax对象。

```javascript
Gax("http://iwenku.net").get().success(function(data){
	console.log(data);
}).error(function(args){
	console.log(args);
});
```
