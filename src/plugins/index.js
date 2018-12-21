import Vue from 'vue';
import VueLazyComponent from '@xunlei/vue-lazy-component';
import {
    Pagination,
    Autocomplete,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Menu,
    Submenu,
    MenuItem,
    Input,
    Checkbox,
    CheckboxGroup,
    Select,
    Option,
    Button,
    Table,
    TableColumn,
    DatePicker,
    Popover,
    Tooltip,
    Form,
    FormItem,
    Tree,
    Icon,
    Row,
    Col,
    Carousel,
    CarouselItem,
    Loading,
    MessageBox,
    Message,
    Notification,
    Scrollbar
} from 'element-ui';

Vue.use(VueLazyComponent);

Vue.use(Pagination);
Vue.use(Autocomplete);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Input);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(DatePicker);
Vue.use(Popover);
Vue.use(Tooltip);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Tree);
Vue.use(Icon);
Vue.use(Row);
Vue.use(Col);
Vue.use(Carousel);
Vue.use(Scrollbar);
Vue.use(CarouselItem);
Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
