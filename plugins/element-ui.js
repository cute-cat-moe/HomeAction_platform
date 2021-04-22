import Vue from 'vue'
import locale from 'element-ui/lib/locale/lang/zh-CN'
import 'element-ui/lib/theme-chalk/index.css'
import {
    Button,
    Avatar,
    Divider,
    Container,
    Aside,
    Main,
    Header,
    Menu,
    MenuItem,
    Submenu,
    Message,
    Form,
    FormItem,
    Input,
    Breadcrumb,
    BreadcrumbItem,
    Pagination,
    Table,
    TableColumn,
    Card,
    DatePicker,
    Row,
    Col,
    Tabs,
    TabPane,
    Tag,
    Image,
    Drawer,
    Checkbox,
    CheckboxGroup,
    Select,
    Option,
} from 'element-ui'

Vue.use(Button, { locale })
Vue.use(Avatar, { locale })
Vue.use(Divider, { locale })
Vue.use(Container, { locale })
Vue.use(Aside, { locale })
Vue.use(Main, { locale })
Vue.use(Header, { locale })
Vue.use(Menu, { locale })
Vue.use(MenuItem, { locale })
Vue.use(Submenu, { locale })
Vue.use(Form, { locale })
Vue.use(FormItem, { locale })
Vue.use(Input, { locale })
Vue.use(Breadcrumb, { locale })
Vue.use(BreadcrumbItem, { locale })
Vue.use(Pagination, { locale })
Vue.use(Table, { locale })
Vue.use(TableColumn, { locale })
Vue.use(Card, { locale })
Vue.use(DatePicker, { locale })
Vue.use(Row, { locale })
Vue.use(Col, { locale })
Vue.use(Tabs, { locale })
Vue.use(TabPane, { locale })
Vue.use(Tag, { locale })
Vue.use(Image, { locale })
Vue.use(Drawer, { locale })
// Vue.use(MessageBox, { locale })
Vue.use(Checkbox, { locale })
Vue.use(CheckboxGroup, { locale })
Vue.use(Select, { locale })
Vue.use(Option, { locale })

Vue.prototype.$message = Message
// Vue.prototype.$confirm = MessageBox.confirm
// Vue.prototype.$alert = MessageBox.alert
