import Vue from 'vue';
import {
    Menu,
    Submenu,
    MenuItem,
    Card,
    Input,
    Button,
    Table,
    TableColumn,
    Slider,
    Notification,
    Drawer,
    InfiniteScroll,
    Message,
    Popover,
    Tooltip,
    Form,
    FormItem,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Upload,
    Radio,
    RadioGroup,
    RadioButton,
    InputNumber,
    Tabs,
    TabPane,
    MessageBox,
    Row,
    Col,
    Progress
} from 'element-ui';

Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Card);
Vue.use(Input);
Vue.use(Button);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Slider);
Vue.use(Drawer),
Vue.use(InfiniteScroll),
Vue.use(Popover),
Vue.use(Tooltip),
Vue.use(Form),
Vue.use(FormItem),
Vue.use(Dropdown),
Vue.use(DropdownMenu),
Vue.use(DropdownItem),
Vue.use(Upload),
Vue.use(Radio),
Vue.use(RadioGroup),
Vue.use(RadioButton),
Vue.use(InputNumber),
Vue.use(Tabs),
Vue.use(TabPane),
Vue.use(Row),
Vue.use(Col),
Vue.use(Progress),
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
Vue.prototype.$MessageBox = MessageBox;
