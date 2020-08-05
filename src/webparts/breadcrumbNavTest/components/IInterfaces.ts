import { IContentTypeInfo } from "@pnp/sp/presets/all";

export interface IDetailsListContent {
  type: number;
  content: IDetailsListBasicItem[] | IDetailsListDocumentItem[];
}

export interface IDetailsListBasicItem {
  key: number;
  name: string;
  value: string;
}

export interface IDetailsListDocumentItem {
  id: number;
  title: string;
  fieldStr: string;
  fieldInt: number;
}

export interface ISearchParams {
  name: string;
  value: string;
}
