import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },

  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "静态资源管理", icon: "dashboard" },
      },
    ],
  },
  {
    path: "/news",
    component: Layout,
    redirect: "/news/index",
    // name: 'News',
    // meta: { title: '新闻', icon: 'form' },
    children: [
      {
        path: "index",
        name: "News",
        component: () => import("@/views/news/index"),
        meta: { title: "新闻", icon: "form" },
      },
      {
        path: "edit",
        name: "NewsEdit",
        component: () => import("@/views/news/edit"),
        hidden: true,
        meta: { title: "新增编辑新闻", icon: "el-icon-s-cooperation" },
      },
    ],
  },
  {
    path: "/brand",
    component: Layout,
    redirect: "/brand/index",
    children: [
      {
        path: "index",
        name: "Brand",
        component: () => import("@/views/brand/index"),
        meta: { title: "品牌", icon: "el-icon-s-flag" },
      },
      {
        path: "edit",
        name: "BrandEdit",
        component: () => import("@/views/brand/edit"),
        hidden: true,
        meta: { title: "新增编辑品牌", icon: "form" },
      },
    ],
  },
  {
    path: "/classfiy",
    component: Layout,
    redirect: "/classfiy/index",
    children: [
      {
        path: "index",
        name: "Classfiy",
        component: () => import("@/views/classfiy/index"),
        meta: { title: "产品类别", icon: "el-icon-s-management" },
      },
      {
        path: "edit",
        name: "ClassfiyEdit",
        component: () => import("@/views/classfiy/edit"),
        hidden: true,
        meta: { title: "新增编辑产品类别", icon: "form" },
      },
    ],
  },
  {
    path: "/product",
    component: Layout,
    redirect: "/product/index",
    children: [
      {
        path: "index",
        name: "Product",
        component: () => import("@/views/product/index"),
        meta: { title: "产品", icon: "el-icon-s-open" },
      },
      {
        path: "edit",
        name: "ProductEdit",
        component: () => import("@/views/product/edit"),
        hidden: true,
        meta: { title: "新增编辑产品", icon: "form" },
      },
    ],
  },
  {
    path: "/company",
    component: Layout,
    redirect: "/company/index",
    children: [
      {
        path: "index",
        name: "Company",
        component: () => import("@/views/company/index"),
        meta: { title: "公司信息", icon: "el-icon-s-check" },
      },
    ],
  },
  {
    path: "/banner",
    component: Layout,
    redirect: "/banner/index",
    children: [
      {
        path: "index",
        name: "Banner",
        component: () => import("@/views/banner/index"),
        meta: { title: "banner管理", icon: "el-icon-s-data" },
      },
    ],
  },
  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/table',
  //   name: 'Example',
  //   meta: { title: 'Example', icon: 'el-icon-s-help' },
  //   children: [
  //     {
  //       path: 'table',
  //       name: 'Table',
  //       component: () => import('@/views/table/index'),
  //       meta: { title: 'Table', icon: 'table' }
  //     },
  //     {
  //       path: 'tree',
  //       name: 'Tree',
  //       component: () => import('@/views/tree/index'),
  //       meta: { title: 'Tree', icon: 'tree' }
  //     }
  //   ]
  // },

  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: 'Form', icon: 'form' }
  //     }
  //   ]
  // },

  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       name: 'Menu2',
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true },
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
