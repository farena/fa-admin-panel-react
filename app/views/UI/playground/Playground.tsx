import FormTextPlayground from "./_FormTextPlayground";
import FormNumberPlayground from "./_FormNumberPlayground";
import FormSwitchPlayground from "./_FormSwitchPlayground";
import FormCheckboxPlayground from "./_FormCheckboxPlayground";
import FormBlockPlayground from "./_FormBlockPlayground";
import FormDropdownPlayground from "./_FormDropdownPlayground";
import FormComboboxPlayground from "./_FormComboboxPlayground";
import CalendarPlayground from "./_CalendarPlayground";
import FormButtonPlayground from "./_FormButtonPlayground";
import FormSelectPlayground from "./_FormSelectPlayground";
import FormBooleanPlayground from "./_FormBooleanPlayground";
import FormLinkPlayground from "./_FormLinkPlayground";
import FormTimePlayground from "./_FormTimePlayground";
import FormWeeklyDatePlayground from "./_FormWeeklyDatePlayground";
import FormDatePlayground from "./_FormDatePlayground";
import FormDateRangePlayground from "./_FormDateRangePlayground";
import ToastPlayground from "./_ToastPlayground";
import FormUploaderPlayground from "./_FormUploaderPlayground";
import FormCommentPlayground from "./_FormCommentPlayground";
import FormCodePlayground from "./_FormCodePlayground";
import FormImageCropperPlayground from "./_FormImageCropperPlayground";
import FormColorpickerPlayground from "./_FormColorpickerPlayground";
import TabsPlayground from "./_TabsPlayground";
import FormHtmlPlayground from "./_FormHtmlPlayground";
import AccordionPlayground from "./_AccordionPlayground";
import InfiniteScrollPlayground from "./_InfiniteScrollPlayground";
import SimplePagerPlayground from "./_SimplePagerPlayground";
import WidgetPlayground from "./_WidgetPlayground";
import ChartsPlayground from "./_ChartsPlayground";
import { NavLink } from "react-router";

const DEV_ROUTES = [
  { label: "Playground", to: "/" },
  { label: "Login", to: "/login" },
  { label: "Forgot password", to: "/forgot_password" },
  { label: "Reset password", to: "/reset_password/test-token" },
  { label: "Activate user", to: "/activate_user/test-token" },
  { label: "Dashboard", to: "/dashboard" },
];

export default function Playground() {
  return (
    <>
      <nav className="nav bg-primary border-bottom py-1">
        <div className="container">
          <div className="d-flex justify-content-between">
            {DEV_ROUTES.map((route) => (
              <NavLink
                key={route.to}
                to={route.to}
                end
                className={({ isActive }) =>
                  `nav-link text-white${isActive ? " font-weight-bold" : ""}`
                }
              >
                {route.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
      <div className="container py-4">
        <h2 className="mb-1">UI Playground</h2>
        <p className="text-muted mb-4">
          Sandbox to test the <code>components/Form</code> components.
        </p>

        <FormTextPlayground />
        <FormNumberPlayground />
        <FormSwitchPlayground />
        <FormCheckboxPlayground />
        <FormBlockPlayground />
        <FormDropdownPlayground />
        <FormComboboxPlayground />
        <CalendarPlayground />
        <FormButtonPlayground />
        <FormSelectPlayground />
        <FormBooleanPlayground />
        <FormLinkPlayground />
        <FormTimePlayground />
        <FormWeeklyDatePlayground />
        <FormDatePlayground />
        <FormDateRangePlayground />
        <ToastPlayground />
        <FormUploaderPlayground />
        <FormCommentPlayground />
        <FormCodePlayground />
        <FormImageCropperPlayground />
        <FormColorpickerPlayground />
        <TabsPlayground />
        <FormHtmlPlayground />
        <AccordionPlayground />
        <InfiniteScrollPlayground />
        <SimplePagerPlayground />
        <WidgetPlayground />
        <ChartsPlayground />
      </div>
    </>
  );
}
