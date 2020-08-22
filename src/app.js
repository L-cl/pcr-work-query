import Vue from 'vue';
import App from './App.vue';
import { createRouter } from './router';
import { createStore } from './store';
import {
  Button,
  Input,
  Tabs,
  TabPane,
  Table,
  TableColumn,
  Form,
  FormItem,
  Select,
  Option,
  Image,
  Upload,
  Tooltip,
  Dialog,
  Message,
  MessageBox,
  Loading,
} from 'element-ui';

import 'normalize.css';

Vue.use(Button);
Vue.use(Input);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Select);
Vue.use(Option);
Vue.use(Image);
Vue.use(Upload);
Vue.use(Tooltip);
Vue.use(Dialog);
Vue.use(Loading.directive);
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;

export function createApp() {
  const router = createRouter();
  const store = createStore();
  const app = new Vue({
    router,
    store,
    render: (h) => h(App),
  });

  return { app, router, store };
}
