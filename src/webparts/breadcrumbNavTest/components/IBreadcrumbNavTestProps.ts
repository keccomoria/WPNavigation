import { DisplayMode } from "@microsoft/sp-core-library";
import { IDetailsListBasicItem } from "./IDetailsListBasicItem";

export interface IBreadcrumbNavTestProps {
  getLinks: () => IDetailsListBasicItem[];
  displayMode: DisplayMode;
}
