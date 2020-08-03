import { IContentTypeInfo } from "@pnp/sp/presets/all";

export interface IDetailsListContent {
  type: string;
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
  fieldStr1: string;
  fieldStr2: string;
  fieldDt3: Date;
  fieldInt4: number;
}

export interface ISearchParams {
  name: string;
  value: string;
}
