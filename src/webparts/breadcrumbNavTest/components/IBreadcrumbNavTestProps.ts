import { DisplayMode } from "@microsoft/sp-core-library";
import { IDetailsListBasicItem } from "./IInterfaces";

export interface IBreadcrumbNavTestProps {
  getLinks: () => IDetailsListBasicItem[];
  displayMode: DisplayMode;
}
