import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
/* Layout */
import Layout from '@/layout'

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
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/403',
    component: () => import('@/views/error-page/403'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',

    meta: { roles: '', permission: '' },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'dashboard',
        meta: {
          title: 'dashboard',
          permission: '',
          roles: '',
          icon: 'dashboard',
          noCache: true,
          affix: true
        }
      }
    ]
  },
  {
    path: '/grades',
    component: Layout,

    meta: { roles: '', permission: 'Access_Grade' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/pages/GradesList'),
        name: 'GradesList',
        meta: {
          title: 'Grades',
          permission: 'Access_Grade',
          roles: '',
          icon: 'el-icon-shopping-cart-full',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/classes',
    component: Layout,
    meta: { roles: '', permission: 'Access_Class' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/pages/ClassesList'),
        name: 'ClassesList',
        meta: {
          title: 'classes',
          permission: 'Access_Class',
          roles: '',
          icon: 'el-icon-s-unfold',
          noCache: true
        }
      },
      {
        path: 'groups_sorting',
        component: () => import('@/views/pages/GroupsSorting'),
        name: 'GroupsSorting',
        meta: {
          title: 'groups_sorting',
          permission: 'Access_Orders',
          roles: '',
          icon: 'el-icon-shopping-bag-1',
          noCache: true
        },
        hidden: true
      }
    ]
  },
  {
    path: '/sections',
    component: Layout,
    meta: { roles: '', permission: 'Access_Section' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/pages/SectionsList'),
        name: 'SectionsList',
        meta: {
          title: 'sections',
          permission: 'Access_Section',
          roles: '',
          icon: 'el-icon-s-unfold',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/students',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true,
    name: 'students',
    meta: {
      title: 'students',
      icon: 'el-icon-document',
      roles: '',
      permission: 'Access_Student'
    },
    children: [
      {
        path: 'Student_information',
        component: () => import('@/views/pages/StudentsList'),
        name: 'StudentsList',
        meta: {
          title: 'information_student',
          roles: '',
          permission: 'Access_Student',
          icon: ''
        }
      },
      {
        path: 'Students_Promotions',
        component: () => import('@/views/pages/StudentsPromotions'),
        name: 'StudentsPromotions',
        meta: {
          title: 'Students_Promotions',
          roles: '',
          permission: 'Access_Students',
          icon: ''
        }
      },
      {
        path: 'Graduate_students',
        component: () => import('@/views/pages/GraduateStudents'),
        name: 'GraduateStudents',
        meta: {
          title: 'Graduate_students',
          roles: '',
          permission: 'Access_Students',
          icon: ''
        }
      }
    ]
  },
  {
    path: '/Teachers',
    component: Layout,

    meta: { roles: '', permission: 'Access_Teacher' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/pages/TeachersList'),
        name: 'TeachersList',
        meta: {
          title: 'Teachers',
          permission: 'Access_Teacher',
          roles: '',
          icon: 'el-icon-shopping-bag-1',
          noCache: true
        }
      },
      {
        path: 'deleted_orders',
        component: () => import('@/views/pages/DeletedOrdersList'),
        name: 'DeletedOrdersList',
        meta: {
          title: 'deleted_orders',
          permission: 'Access_Orders',
          roles: '',
          icon: 'el-icon-shopping-bag-1',
          noCache: true
        },
        hidden: true
      }
    ]
  },
  {
    path: '/Parents',
    component: Layout,

    meta: { roles: '', permission: 'Access_Parent' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/pages/Kitchen'),
        name: 'Parents',
        meta: {
          title: 'Parents',
          permission: 'Access_Parent',
          roles: '',
          icon: 'el-icon-knife-fork',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/accounts',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true,
    name: 'Accounts',
    meta: {
      title: 'Accounts',
      icon: 'el-icon-document',
      roles: '',
      permission: 'Access_Accounts'
    },
    children: [
      {
        path: 'Student_information1',
        component: () => import('@/views/pages/StudentsList'),
        name: 'Student_information',
        meta: {
          title: 'information_student',
          roles: '',
          permission: 'Access_Students',
          icon: ''
        }
      },
      {
        path: 'Students_Promotions2',
        component: () => import('@/views/pages/StudentsPromotions'),
        name: 'Students_Promotions',
        meta: {
          title: 'Students_Promotions',
          roles: '',
          permission: 'Access_Students',
          icon: ''
        }
      },
      {
        path: 'Students_Promotions3',
        component: () => import('@/views/pages/StudentsPromotions'),
        name: 'Students_Promotions',
        meta: {
          title: 'Students_Promotions',
          roles: '',
          permission: 'Access_Students',
          icon: ''
        }
      },
      {
        path: 'Students_Promotions4',
        component: () => import('@/views/pages/StudentsPromotions'),
        name: 'Students_Promotions',
        meta: {
          title: 'Students_Promotions',
          roles: '',
          permission: 'Access_Students',
          icon: ''
        }
      },
      {
        path: 'Graduate_students5',
        component: () => import('@/views/pages/StudentsPromotions'),
        name: 'Graduate_students',
        meta: {
          title: 'Graduate_students',
          roles: '',
          permission: 'Access_Students',
          icon: ''
        }
      }
    ]
  },
  {
    path: '/Attendance',
    component: Layout,

    meta: { roles: '', permission: 'Access_Attendances' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/pages/AttendanceList'),
        name: 'AttendanceList',
        meta: {
          title: 'Attendance',
          permission: 'Access_Attendances',
          roles: '',
          icon: 'el-icon-knife-fork',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/subjects',
    component: Layout,

    meta: { roles: '', permission: 'Access_Subjects' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/pages/SubjectsList'),
        name: 'SubjectsList',
        meta: {
          title: 'subjects',
          permission: 'Access_Subjects',
          roles: '',
          icon: 'el-icon-notebook-2',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/Student1',
    component: Layout,

    meta: { roles: '', permission: 'Access_Student_Balance' },
    children: [
      {
        path: 'balance',
        component: () => import('@/views/pages/Student1'),
        name: 'Student',
        meta: {
          title: 'student',
          roles: '',
          permission: '',
          icon: 'el-icon-user',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/Student2',
    component: Layout,

    meta: { roles: '', permission: 'Access_Student_Balance' },
    children: [
      {
        path: 'balance',
        component: () => import('@/views/pages/Student1'),
        name: 'Student',
        meta: {
          title: 'student',
          roles: '',
          permission: '',
          icon: 'el-icon-user',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/Student3',
    component: Layout,

    meta: { roles: '', permission: 'Access_Student_Balance' },
    children: [
      {
        path: 'balance',
        component: () => import('@/views/pages/Student1'),
        name: 'Student',
        meta: {
          title: 'student',
          roles: '',
          permission: '',
          icon: 'el-icon-user',
          noCache: true
        }
      }
    ]
  },

  {
    path: '/setting',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true,
    name: 'setting',
    meta: {
      title: 'settings',
      icon: 'el-icon-s-tools',
      roles: '',
      permission: 'Access_Setting'
    },
    children: [
      // {
      //   path: 'cafeterias',
      //   component: () => import('@/views/pages/CafeteriasList'),
      //   name: 'Cafeterias',
      //   meta: {
      //     title: 'cafeterias',
      //     roles: '',
      //     permission: '',
      //     icon: '',
      //     noCache: true
      //   }
      // },

      {
        path: 'student-balance/:id',
        component: () => import('@/views/pages/StudentBalance'),
        name: 'StudentBalance',
        meta: {
          title: 'Student Balance',
          roles: '',
          permission: '',
          icon: ''
        },
        hidden: true
      },
      {
        path: 'cafeteria/entry/:id?',
        component: () => import('@/views/pages/CafeteriaEntry'),
        name: 'CafeteriaEntry',
        meta: { title: 'Cafeteria Entry', icon: 'role' },
        hidden: true
      },
      {
        path: 'item/entry/:id?',
        component: () => import('@/views/pages/ItemEntry'),
        name: 'ItemEntry',
        meta: { title: 'Item Entry', icon: 'role' },
        hidden: true
      },

      {
        path: 'order/print/:id',
        component: () => import('@/views/pages/PrintOrder'),
        name: 'ItemEntry',
        meta: { title: 'Print Order', icon: 'role' },
        hidden: true
      },

      {
        path: 'items/add',
        component: () => import('@/views/pages/AddItem'),
        name: 'AddItem',
        meta: { title: 'Add Item', icon: 'user' },
        hidden: true
      },
      {
        path: '/user_management',
        component: () => import('@/views/nested/menu1/index'),
        redirect: 'noRedirect',
        alwaysShow: true,
        name: 'user_managemet',
        meta: {
          title: 'user_managemet',
          icon: '',
          roles: '',
          permission: 'User_Management'
        },
        children: [
          {
            path: 'users',
            component: () => import('@/views/pages/UsersList'),
            name: 'UserList',
            meta: {
              title: 'users',
              roles: '',
              permission: 'Access_Users',
              icon: 'user',
              noCache: true
            }
          },
          {
            path: 'roles',
            component: () => import('@/views/pages/RolesList'),
            name: 'RoleList',
            meta: {
              title: 'roles',
              roles: '',
              permission: 'Access_Roles',
              icon: 'documentation',
              noCache: true
            }
          },
          // {
          //   path: 'user/add',
          //   component: () => import('@/views/pages/AddUser'),
          //   name: 'AddUser',
          //   meta: { title: 'add_user', icon: 'users', permission: '' },
          //   hidden: true
          // },
          // {
          //   path: 'user/edit/:id(\\d+)',
          //   component: () => import('@/views/pages/EditUser'),
          //   name: 'EditUser',
          //   meta: { title: 'edit_user', icon: 'user', permission: '' },
          //   hidden: true
          // },
          {
            path: 'role/entry/:id?',
            component: () => import('@/views/pages/RoleEntry'),
            name: 'RoleEntry',
            meta: { title: 'Role Entry', icon: 'role' },
            hidden: true
          },
          {
            path: 'user/entry/:id?',
            component: () => import('@/views/pages/UserEntry'),
            name: 'UserEntry',
            meta: { title: 'User Entry', icon: 'role' },
            hidden: true
          }
          // {
          //   path: 'role/add',
          //   component: () => import('@/views/pages/RoleEntry'),
          //   name: 'AddRole',
          //   meta: { title: 'add_role', icon: 'role', permission: '' },
          //   hidden: true
          // },
          // {
          //   path: 'role/edit/:id(\\d+)',
          //   component: () => import('@/views/pages/EditRole'),
          //   name: 'EditRole',
          //   meta: { title: 'edit_role', icon: 'role', permission: '' },
          //   hidden: true
          // }
        ]
      }
    ]
  }
]

export const asyncRoutes = []

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
