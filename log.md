# 日志

## 3.22

* 在babel与vue任务之间反复横跳，最终选择做vue组件，借这个机会加深对vue组件的了解

* 上网查了查瀑布流、骨架屏等名词，大概了解了需要实现的效果

* 创建git版本库

* 这两天就先想想有关设计，决定一下要做哪些需求，从哪开始做起等等

  （周六、周末要考计算机三四级还得先肝这个）

## 3.23

* 备考计算机三、四级

## 3.24

* 上午备考三四级
* 下午打了场篮球赛
* 晚上code了一点点：

  * 决定先完成瀑布流布局、懒加载、骨架屏，然后再考虑组件的复用性、拓展性
  * 先是用mock伪造json数据，模拟请求图片
  * 再者查了好久的瀑布流布局实现方式（感觉没找到一个满意的），想着应该在什么CSS布局基础实现瀑布流，最后还是选择用flex+column
  * 大体布局思路有了，code还是好慢，要解决比如如何在图片渲染前重设宽高等


## 3.25

* 上午硬是被JS异步整麻了，你永远都不知道异步数据什么时候能得到，还有发现了一个关于父子组件生命周期顺序的玩意

  ```
  父beforeCreate->父created->父beforeMount->子beforeCreate->子created->子beforeMount->子mounted->父mounted
  ```

* 今天又想了一番，还是用定位进行布局，直接按行往下排，flex中换行一些东西依赖父盒子，感觉不好控制

* 下午晚上有课，预计未来两天依旧是计算机考试

## 3.26

* 准备考试

## 3.27

* 考试结束，晚上终于有时间写代码了！！
* 今晚主要碰到并解决了三个问题
  * 子组件到底什么时候拿到props的数据并进行渲染，发现在mounted、beforeUpdate中ref依然获取不到图片列表实例，暂前将操作放在updated中（这个问题的根源就是子组件实例创建挂载的同时父组件还在请求数据！）
  * 之前一直纠结用什么样的css布局结构（order之类的）来排列盒子更方便，但当我真正用定位去布局时发现也并不复杂（而且添加过渡后，若要再次改变位置就可以得到动画效果）
  * 盒子排好了但是顺序不对，这个bug找了好久。最终发现遍历数组时调用的img.onload是个异步函数，在微任务中每次遍历并不是顺序完成，之后采用promise+await实现阻塞加载，解决问题。

## 3.28

* 今天主要做了骨架屏的显示、填昨天的坑、代码重构
* 记录一个坑：foreach遍历并不一定是顺序的（昨天好像就发现了，但好像又没发现）
* 重构代码=无限填写bug修bug，不过代码耦合度降低了不少，函数拆分后提高了复用性
* 留的一个坑：加载失败重新加载的图片的顺序可能会错乱
* 预计明天：根据视口大小重排、触底加载

## 3.29

* 基本效果已经完成
* 但是发现了一个惊天BUG！！！非常离谱，我明明没有修改之前的逻辑啊啊啊啊啊！暂时没找到，明天再看看

## 3.30

* 吓得我差点没睡好觉，今天一早就找到问题了：
  * 起初：没开控制台一切正常，一开控制台加载就炸了
  
  * 仔细观察控制台，我发现network（之前调试开的低网速）下的disabled cache（可能不小心点到的）开着在，我想这不是缓存有关的吗，在仔细看控制台发现我的所有图片被加载了两遍，所以导致我的同步阻塞加载出问题
  
  * 经查询后发现disabled cache选项可以禁止浏览器使用缓存，这下全部就说得通了
  
  * 关掉该选项，刷新页面，加载一切正常
  
    

* 暂前先这样了....
