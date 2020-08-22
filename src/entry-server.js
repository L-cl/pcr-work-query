import { createApp } from './app';

export default (context) => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp();

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
              cookie: context.cookie,
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
