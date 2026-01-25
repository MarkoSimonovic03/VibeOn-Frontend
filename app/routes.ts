import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("layout/Layout.tsx", [
    route("/", "routes/Home.tsx"),
    route("friends", "routes/Friends.tsx"),
    route("create", "routes/CreatePost.tsx"),
    route("profile/:username", "routes/Profile.tsx"),
    route("chat-test", "routes/ChatTestPage.tsx"),
    route("chats", "routes/ChatsPage.tsx"),
    route("chat/:username", "routes/ChatPage.tsx"),
    route("*", "routes/RedirectToHome.tsx")
  ]),

  layout('layout/LayoutLoginRegister.tsx', [
    route("login", "routes/Login.tsx"),
    route("register", "routes/Register.tsx")
  ])

] satisfies RouteConfig;
