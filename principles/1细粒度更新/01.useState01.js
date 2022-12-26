// 什么叫细粒度更新？ 
    // 就是能够自动追踪依赖的技术
        // 如vue3中的 computed(() => x.value *2 + 1) 自动追踪x为依赖
// 首先我们来实现useState
    function useState(value) {
        const getter = () => value;
        const setter = (newValue) => newValue;
        return [getter, setter]
    }