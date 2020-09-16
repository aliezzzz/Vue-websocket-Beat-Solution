## Vue & websocket 最佳解决方案

- 在Vue的实例的options中定义sockets对象，通过mixin在每个生命周期created时，读取options中的配置绑定到wscallback对象中
- 当onmessage接收到消息，调用对应的函数，即可获取到当前Vue实例

### 使用方法
```js
// main.js
import { plugin } from '@/utils/socketPlugin'
Vue.use(plugin)
```

```html
<script>
  export default {
    // 在Vue文件中定义 sockets options 接收websocket 的onmessage
    data () {
      return {
        name: ''
      }
    }
    sockets: {
      config (data) {
        console.log(data) // onmessage 返回的数据
        console.log(this.name) // ''
        this.name = 'changed name'
        console.log(this.name) // 'changed name'
      }
    }
  }
</script>
```

```js
// 发送请求
import { send } from '@/utils/socketPlugin'

send({
  action: 'test'
})
```