import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("views/UI/playground/Playground.tsx"), // Playground to test our components
  layout("views/_Layouts/PublicLayout.tsx", [
    route("login", "views/Public/Login.tsx"),
    route("forgot_password", "views/Public/ForgotPassword.tsx"),
    route("reset_password/:token", "views/Public/ResetPassword.tsx"),
    route("activate_user/:token", "views/Public/ActivateUser.tsx"),
  ]),
] satisfies RouteConfig;
