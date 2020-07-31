import { DisplayMode } from "@microsoft/sp-core-library";
import { IDetailsListBasicItem } from "./IInterfaces";
import { IBreadcrumbItem } from "office-ui-fabric-react/lib/Breadcrumb";

export interface IBreadcrumbNavTestProps {
  getLinks: () => IDetailsListBasicItem[];
  getBreadCrumbItems: () => IBreadcrumbItem[];
  _onBreadcrumbItemClicked: (ev: React.MouseEvent<HTMLElement>, item: IBreadcrumbItem) => void;
  displayMode: DisplayMode;
}
