<script setup>
import { onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import useAuth from "../../composable/useAuth";
import profile from "../../assets/images/administrator.jpg";

onMounted(() => {
  document.body.className ="nk-body bg-white npc-default has-aside";
})

const router = useRouter();
const { user, logout } = useAuth();
const route = useRoute();

const setActive = (name) => {
  const split = name.split("|");

  const isActive = split.some((name) => name === route.name)

  return isActive && "active";
}

const signOut = () => {
  logout().then(() => { router.push({name: "Login"}); });
}

</script>

<template>
  <div class="nk-main">
    <div class="nk-wrap">
      <div class="nk-header nk-header-fixed is-light">
        <div class="container-lg wide-xl">
          <div class="nk-header-wrap">
            <div class="nk-header-brand">
              <Router-Link :to="{ name: 'Dashboard' }" class="logo-link">
                <img src="/favicon.png" alt="NORSU Logo" class="logo-light logo-img" />
                <img src="/favicon.png" alt="NORSU Logo" class="logo-dark logo-img" />
              </Router-Link>
            </div>
            <div class="nk-header-menu">
              <ul class="nk-menu nk-menu-main">
                <li class="nk-menu-item" :class="setActive('Dashboard')">
                  <Router-Link :to="{ name: 'Dashboard' }" class="nk-menu-link">
                    <span class="nk-menu-text">Dashboard</span>
                  </Router-Link>
                </li>
                <li class="nk-menu-item" :class="setActive('Post|ShowPost|CreatePost|EditPost')">
                  <Router-Link :to="{ name: 'Post' }" class="nk-menu-link">
                    <span class="nk-menu-text">Posts</span>
                  </Router-Link>
                </li>
                <li class="nk-menu-item" :class="setActive('Student|ShowStudent')">
                  <Router-Link :to="{ name: 'Student' }" class="nk-menu-link">
                    <span class="nk-menu-text">Students</span>
                  </Router-Link>
                </li>
                <li class="nk-menu-item" :class="setActive('Admin')" v-if="user.is_super && user.college === '*'">
                  <Router-Link :to="{ name: 'Admin' }" class="nk-menu-link">
                    <span class="nk-menu-text">Admins</span>
                  </Router-Link>
                </li>
              </ul>
            </div>
            <div class="nk-header-tools">
              <ul class="nk-quick-nav">
                <li>
                  <Router-Link :to="{ name: 'CreatePost' }">
                    <span class="text-dark fw-bold">Create</span>
                  </Router-Link>
                </li>
                <li class="dropdown user-dropdown">
                  <a href="#" class="dropdown-toggle mr-lg-n1" data-toggle="dropdown">
                    <div class="user-toggle">
                      <div class="user-avatar sm">
                        <img :src="profile" alt="Profile Avatar" />
                      </div>
                    </div>
                  </a>
                  <div class="dropdown-menu dropdown-menu-md dropdown-menu-right dropdown-menu-s1">
                    <div class="dropdown-inner user-card-wrap bg-lighter d-none d-md-block">
                      <div class="user-card">
                        <div class="user-avatar">
                          <img :src="profile" alt="Profile Avatar" />
                        </div>
                        <div class="user-info">
                          <span class="lead-text">{{ user.name }}</span>
                          <span class="sub-text text-danger">Administrator</span>
                        </div>
                      </div>
                    </div>
                    <div class="dropdown-inner d-lg-none">
                      <ul class="link-list">
                        <li :class="setActive('Dashboard')">
                          <Router-Link :to="{ name: 'Dashboard' }">
                            <vue-feather type="pie-chart" size="15" />
                            <span class="ml-1">Dashboard</span>
                          </Router-Link>
                        </li>
                        <li :class="setActive('Post|ShowPost|CreatePost|EditPost')">
                          <Router-Link :to="{ name: 'Post' }">
                            <vue-feather type="message-square" size="15" />
                            <span class="ml-1">Posts</span>
                          </Router-Link>
                        </li>
                        <li :class="setActive('Student|ShowStudent')">
                          <Router-Link :to="{ name: 'Student' }">
                            <vue-feather type="users" size="15" />
                            <span class="ml-1">Students</span>
                          </Router-Link>
                        </li>
                        <li :class="setActive('Admin')" v-if="user.is_super && user.college === '*'">
                          <Router-Link :to="{ name: 'Admin' }">
                            <vue-feather type="users" size="15" />
                            <span class="ml-1">Admins</span>
                          </Router-Link>
                        </li>
                      </ul>
                    </div>
                    <div class="dropdown-inner">
                      <ul class="link-list">
                        <li>
                          <Router-Link :to="{ name: 'Profile' }">
                            <vue-feather type="user" size="15" />
                            <span class="ml-1">View Profile</span>
                          </Router-Link>
                        </li>
                        <li>
                          <a href="#" @click.prevent="signOut">
                            <vue-feather type="log-out" size="15" />
                            <span class="ml-1">Logout</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="nk-content">
        <div class="container wide-xl">
          <div class="nk-content-inner">
            <div class="nk-content-body pt-0">
              <div class="nk-content-wrap">
                <slot />
              </div>
              <div class="nk-footer">
                <div class="container wide-xl">
                  <div class="nk-footer-wrap g-2">
                    <div class="nk-footer-copyright">
                      &copy; 2023 NORSU-BSC Bulletin System, Alright Reserved.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>