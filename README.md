# gdom 使用方法
a javascript framework for operating dom and string<br/>
会用jquey就会用gdom<br/>
gdom选择器有两种写法： G( 选择器 ) 和 $( 选择器 )<br/>
gdom的加载： G( function(){} )    $( function() {} );<br/>

# 选择器用法
gdom完全支持CSS3选择器,下面列举部分用法<br/>
* 基本选择器( id, class, 元素 )
```
$("#box").css( "border", "1px solid #09f" );
$(".box").css( "border", "1px solid #09f" );
G("div").css( "border", "1px solid #09f" );
```
* 后代，子代选择器
```
G("body p").css( "border", "2px solid #09f" );
G("body > p").css( "border", "2px solid #09f" );
```
* 属性选择器
```
G( "[id]" ).css( "border", "1px solid #09f" );
G( "[id][class]" ).css( "border", "1px solid #09f" );
G( "[data-target]" ).css( "border", "1px solid #09f" );
G( "[class*=desc]" ).css( "border", "1px solid #09f" );
G( "[class^=desc]" ).css( "border", "1px solid #09f" );
"[class$=desc]" ).css( "border", "1px solid #09f" );
```
* 过滤选择器
```
G( "div:nth-child(1)").css( "border", "1px solid #09f" );
G( "div:nth-of-type(1)").css( "border", "1px solid #09f" );
G( "div p:nth-of-type(1)" ).css( "border", "1px solid #09f" );
```