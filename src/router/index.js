import { createRouter, createWebHistory } from "vue-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import NotFound from "../views/NotFound.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: () => import("../views/Login.vue"),
    meta: {
      title: "Login",
      auth: false,
    }
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue"),
    meta: {
      title: "Register",
      auth: false,
    }
  },
  {
    path: "/forgot-password",
    name: "Forgot",
    component: () => import("../views/Forgot.vue"),
    meta: {
      title: "Forgot",
      auth: false,
    }
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../views/Dashboard.vue"),
    meta: {
      title: "Dashboard",
      auth: true,
    }
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/Profile.vue"),
    meta: {
      title: "My Profile",
      auth: true,
    }
  },
  {
    path: "/students",
    name: "Student",
    component: () => import("../views/student/Index.vue"),
    meta: {
      title: "List of Students",
      auth: true,
    }
  },
  {
    path: "/students/:uid",
    name: "ShowStudent",
    component: () => import("../views/student/Show.vue"),
    meta: {
      title: "Student Profile",
      auth: true,
    }
  },
  {
    path: "/posts",
    name: "Post",
    component: () => import("../views/post/Index.vue"),
    meta: {
      title: "List of Posts",
      auth: true,
    }
  },
  {
    path: "/posts/create",
    name: "CreatePost",
    component: () => import("../views/post/Create.vue"),
    meta: {
      title: "Create Post",
      auth: true,
    }
  },
  {
    path: "/posts/edit/:uid",
    name: "EditPost",
    component: () => import("../views/post/Edit.vue"),
    meta: {
      title: "Edit Post",
      auth: true,
    }
  },
  {
    path: "/posts/:uid",
    name: "ShowPost",
    component: () => import("../views/post/Show.vue"),
    meta: {
      title: "Post Details",
      auth: true,
    }
  },
  {
    path: "/admins",
    name: "Admin",
    component: () => import("../views/admin/Index.vue"),
    meta: {
      title: "List of Admins",
      auth: true,
    }
  },
  {
    path: "/:catchAll(.*)*",
    name: "NotFound",
    component: NotFound,
    meta: {
      title: "Not Found",
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

router.beforeEach(async (to, _, next) => {
  document.title = `${to.meta.title} | NORSU-BSC Bulletin System`;
  const requiresAuth = to.matched.some((record) => record.meta.auth);
  try {
    const user = await new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => resolve(user));
    });

    if (to.name !== "NotFound") {
      if (!user && requiresAuth) {
        next({name: "Login"});
      }else if (!requiresAuth && user) {
        next({name: "Dashboard"});
      }else {
        next();
      }
    }else {
      next();
    }
  }catch(error) {
    next({name: "NotFound"});
  }
});

export default router;