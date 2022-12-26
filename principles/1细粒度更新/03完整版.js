// 保存effect调用栈
const effectStack = []
function subscripe (effect, subs) {
    // 订阅关系简历
    subs.add(effect);
    // 依赖关系建立
    effect.deps.add(subs);
}
function cleanup (effect) {
    // 从该effect订阅的所有state对应的subs中移除该effect
    for (const subs of effect.deps) {
        subs.delete(effect);
    }
    // 将该effect中的所有依赖的state对应的subs删除
    effect.deps.clear();
}
function useState (value) {
    // 保存订阅了该state的effect
    const subs = new Set();
    const getter = () => {
        // 获取当前上下文的effect
        const effect = effectStack[effectStack.length - 1];
        if (effect) {
            // 建立订阅关系
            subscripe(effect, subs)
        }
        return value;
    }
    const setter = (newValue) => {
        value = newValue;
        // 通知所有订阅了该state的effect执行
        for (const effect of [...subs]){
            effect.execute()
        }
    }
    return [getter, setter]
}
// 我们多个useEffect 会按顺序执行 这就是为什么我们要用栈去做effect的调用栈
function useEffect (callback) {
    const execute = () => {
        // 重置依赖
        cleanup(effect);
        // 将当前effect 推入栈顶
        effectStack.push(effect);
        try {
            // 执行回调
            callback();
        } finally {
            // effct 出栈
            effectStack.pop();
        }
    }
    const effect = {
        execute,
        deps: new Set(),
    }
    // 立即执行一次 建立订阅关系
    execute();
}
function useMemo (callback) {
    const [s, set] = useState();
    // 首次执行callback， 初始化value
    useEffect(() => set(callback()));
    return s;
}
const [value, setValue] = useState(2)
// console.log(value());
useEffect(() => {
    console.log(value());
});
setValue(3);
