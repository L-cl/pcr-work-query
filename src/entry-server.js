import { createApp } from './app';

export default (context) => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp();

    const { url } = context;
    const { fullPath } = router.resolve(url).route;

    if (fullPath !== url) {
      return reject({ url: fullPath });
    }

    router.push(context.url);

    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents();
      // 匹配不到路由 执行 reject 函数，并返回 404
      if (matchedComponents.length === 0) {
        return reject({ code: 404 });
      }

      Promise.all(
        matchedComponents.map((Component) => {
          if (Component.asyncData) {
            return Component.asyncData({
              store,
              route: router.currentRoute,
            });
          }
        })
      )
        .then(() => {
          context.state = store.state;
          resolve(app);
        })
        .catch(reject);
    }, reject);
  });
};
