import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { sp } from '@pnp/sp/presets/all';

import * as strings from 'BreadcrumbNavTestWebPartStrings';
import BreadcrumbNavTest from './components/BreadcrumbNavTest';
import { IBreadcrumbNavTestProps } from './components/IBreadcrumbNavTestProps';

import {
  Logger,
  ConsoleListener,
  LogLevel
} from "@pnp/logging";
import { IDetailsListBasicItem, ISearchParams, IDetailsListContent } from './components/IInterfaces';
import { IBreadcrumbItem } from 'office-ui-fabric-react/lib/Breadcrumb';
// subscribe a listener
Logger.subscribe(new ConsoleListener());

// set the active log level
Logger.activeLogLevel = LogLevel.Info;


export interface IBreadcrumbNavTestWebPartProps {

}

export default class BreadcrumbNavTestWebPart extends BaseClientSideWebPart<IBreadcrumbNavTestWebPartProps> {

  protected onInit(): Promise<void> {
    return super.onInit().then(_ => {
      // other init code may be present
      sp.setup({
        spfxContext: this.context
      });
    });
  }

  public render(): void {
    const element: React.ReactElement<IBreadcrumbNavTestProps> = React.createElement(
      BreadcrumbNavTest,
      {
        getLinks: this._getLinks.bind(this),
        getBreadCrumbItems: this._getBreadCrumbItems.bind(this),
        _onBreadcrumbItemClicked: this._onBreadcrumbItemClicked.bind(this),
        displayMode: this.displayMode,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private getQueryParameters(url: string, filters?: string[]): ISearchParams[] {
    let params = new URLSearchParams(url);
    let paramObj: ISearchParams[] = [];
    params.forEach((value, key) => {
      paramObj.push({ name: key, value: value });
    });

    if (filters) {
      paramObj = paramObj.filter(el => filters.indexOf(el.name) > -1);
    }

    return paramObj;
  }

  private _getBreadCrumbItems(): IBreadcrumbItem[] {
    let items: IBreadcrumbItem[] = [];
    let search: string = window.location.search;
    let paramObj: ISearchParams[] = this.getQueryParameters(search, ["level1", "level2", "level3", "level4", "level5"]);
    let queryParams: string[] = search.split('&');
    let index: number = 0;

    //set the navigation start level
    let startNavigationHref = window.location.href.replace(window.location.search, "");
    items.push({ key: startNavigationHref, text: "Home", isCurrentItem: false });

    paramObj.forEach((searchParam) => {
      let href: string = this._getQueryStringByLevel(queryParams, index);
      // items.push({ key: searchParam.name, text: searchParam.value, href: href, isCurrentItem: false, onClick: this._onBreadcrumbItemClicked });
      items.push({ key: href, text: searchParam.value, isCurrentItem: false });
      index++;
    });

    // set the last breadcrumb as current navigation level
    // and make it not clickable
    items[items.length - 1].isCurrentItem = true;
    return items;
  }

  private _onBreadcrumbItemClicked(ev: React.MouseEvent<HTMLElement>, item: IBreadcrumbItem): void {
    if (item.key) {
      window.location.href = item.key;
    }
  }

  private _getQueryStringByLevel(queryParams: string[], index: number): string {
    let queryStrings: string[] = [];

    switch (index) {
      case 0:
        queryStrings.push(queryParams.filter(x => x.indexOf("level1") > -1).join('&'));
        break;
      case 1:
        queryStrings.push(queryParams.filter(x => x.indexOf("level1") > -1).join('&'));
        queryStrings.push(queryParams.filter(x => x.indexOf("level2") > -1).join('&'));
        break;
      case 2:
        queryStrings.push(queryParams.filter(x => x.indexOf("level1") > -1).join('&'));
        queryStrings.push(queryParams.filter(x => x.indexOf("level2") > -1).join('&'));
        //consider both level3 and level3type
        queryStrings.push(queryParams.filter(x => x.indexOf("level3") > -1).join('&'));
        break;
      case 3:
        queryStrings.push(queryParams.filter(x => x.indexOf("level1") > -1).join('&'));
        queryStrings.push(queryParams.filter(x => x.indexOf("level2") > -1).join('&'));
        //consider both level3 and level3type
        queryStrings.push(queryParams.filter(x => x.indexOf("level3") > -1).join('&'));
        queryStrings.push(queryParams.filter(x => x.indexOf("level4") > -1).join('&'));
        break;
      case 4:
        queryStrings.push(queryParams.filter(x => x.indexOf("level1") > -1).join('&'));
        queryStrings.push(queryParams.filter(x => x.indexOf("level2") > -1).join('&'));
        //consider both level3 and level3type
        queryStrings.push(queryParams.filter(x => x.indexOf("level3") > -1).join('&'));
        queryStrings.push(queryParams.filter(x => x.indexOf("level4") > -1).join('&'));
        queryStrings.push(queryParams.filter(x => x.indexOf("level5") > -1).join('&'));
        break;
      case 5:
        //last level, empty href
        break;
      default:
        break;
    }

    return queryStrings.join("&");
  }

  private _getLinks(): IDetailsListContent {
    let detailsListContent: IDetailsListContent = null;
    let search: string = window.location.search;
    let paramObj: ISearchParams[] = this.getQueryParameters(search, ["level1", "level2", "level3", "level4", "level5", "level6"]);

    switch (paramObj.length) {
      case 0:
        detailsListContent = this.getLinksLv1();
        break;
      case 1:
        detailsListContent = this.getLinksLv2(paramObj[0].value);
        break;
      case 2:
        detailsListContent = this.getLinksLv3(paramObj[0].value, paramObj[1].value);
        break;
      case 3:
        //if level3 exists, check also for level3type
        let tmpLv3Type: ISearchParams[] = this.getQueryParameters(search, ["level3type"]);
        detailsListContent = this.getLinksLv4(paramObj[0].value, paramObj[1].value, paramObj[2].value, tmpLv3Type.length > 0 ? tmpLv3Type[0].value : null);
        break;
      default:
        break;
    }

    return detailsListContent;
  }

  private getLinksLv1(): IDetailsListContent {
    let detailsListContent: IDetailsListContent = { type: 0, content: null };
    let items: IDetailsListBasicItem[] = [];
    let resultsFromSearch: string[] = this.fakeSearch1("");
    let index: number = 0;

    resultsFromSearch.forEach(element => {
      items.push({
        key: index,
        name: element,
        value: `?level1=${element}`
      });
      index++;
    });

    detailsListContent.content = items;
    return detailsListContent;
  }

  private getLinksLv2(level1: string): IDetailsListContent {
    let detailsListContent: IDetailsListContent = { type: 0, content: null };
    let items: IDetailsListBasicItem[] = [];
    let resultsFromSearch: string[] = this.fakeSearch2(level1);
    let index: number = 0;

    resultsFromSearch.forEach(element => {
      items.push({
        key: index,
        name: element,
        value: `?level1=${level1}&level2=${element}`
      });
      index++;
    });

    detailsListContent.content = items;
    return detailsListContent;
  }

  private getLinksLv3(level1: string, level2: string): IDetailsListContent {
    let detailsListContent: IDetailsListContent = { type: this.getTypeOfContentByLevel(3, level1, ""), content: null };
    let items: IDetailsListBasicItem[] = [];
    let resultsFromSearch: string[] = this.fakeSearch3(level1, level2);
    let index: number = 0;

    resultsFromSearch.forEach(element => {
      let level3Type: string = level2 == "Medical Underwriting" || level2 == "Servicing" ? "Category" : "Product";
      items.push({
        key: index,
        name: element,
        value: `?level1=${level1}&level2=${level2}&level3=${element}&level3type=${level3Type}`
      });
      index++;
    });

    detailsListContent.content = items;
    return detailsListContent;
  }

  private getLinksLv4(level1: string, level2: string, level3: string, level3type: string): IDetailsListContent {
    let detailsListContent: IDetailsListContent = { type: this.getTypeOfContentByLevel(4, level1, level3type), content: null };
    let items: IDetailsListBasicItem[] = [];
    let resultsFromSearch: string[] = this.fakeSearch4(level1, level2, level3, level3type);
    let index: number = 0;

    resultsFromSearch.forEach(element => {
      let level3Type: string = level2 == "Medical Underwriting" || level2 == "Servicing" ? "Category" : "Product";
      items.push({
        key: index,
        name: element,
        value: `?level1=${level1}&level2=${level2}&level3=${element}&level3type=${level3Type}`
      });
      index++;
    });

    detailsListContent.content = items;
    return detailsListContent;
  }

  private getTypeOfContentByLevel(levelIndex: number, level1: string, level3type: string): number {
    // 0: navigation links
    // 1: documents
    let typeOfContent: number = 0;

    switch (levelIndex) {
      case 3:
        if (level1 in ["EB - New Business Active Quotes", "EB - New Business Archive Quotes", "EB - Business Development"]) {
          typeOfContent = 1;
        }
        break;
      case 4:
        if (["EB - Existing Business/Servicing – Credit Control", "EB - Documents in Transit", "EB - Documents in Transit (deleted)", "EB - General Queries"].lastIndexOf(level1) > -1) {
          typeOfContent = 1;
        }
        break;
      case 5:
        if ((level1 == "EB - Policy" && (level3type == "Product" || level3type == "Servicing")) || level1 == "EB - Payment Letters") {
          typeOfContent = 1;
        }
        break;
      case 6:
        if (level1 == "EB - Policy" && level3type == "Medical Underwriting") {
          typeOfContent = 1;
        }
        break;
      default:
        break;
    }

    return typeOfContent;
  }

  private fakeSearch1(filters: string): string[] {
    return ["EB - Policy", "EB - Existing Business/Servicing – Credit Control", "EB - New Business Active Quotes", "EB - New Business Archive Quotes", "EB - Business Development",
      "EB - Documents in Transit", "EB - Documents in Transit (deleted)", "EB - Payment Letters", "EB - General Queries"];
  }

  private fakeSearch2(level1: string): string[] {
    switch (level1) {
      case "EB - Policy":
        return ["Policy Number - Company Name 1", "Policy Number - Company Name 2", "Policy Number - Company Name 3"];
      case "EB - Existing Business/Servicing – Credit Control":
        return ["Payment Type 1", "Payment Type 2", "Payment Type 3"];
      case "EB - New Business Active Quotes":
        return ["Work Reference – Quote Reference - Company 1", "Work Reference – Quote Reference - Company 2", "Work Reference – Quote Reference - Company 3", "Work Reference – Quote Reference - Company 4"];
      case "EB - New Business Archive Quotes":
        return ["Work Reference – Quote Reference - Company 5", "Work Reference – Quote Reference - Company 6"];
      case "EB - Business Development":
        return ["Company 1", "Company 2"];
      case "EB - Documents in Transit":
        return ["Department 1", "Department 2", "Department 3"];
      case "EB - Documents in Transit (deleted)":
        return ["Department 4", "Department 5", "Department 6", "Department 7"];
      case "EB - Payment Letters":
        return ["2002", "2003", "2004", "2005", "2006"];
      case "EB - General Queries":
        return ["2007", "2008", "2009", "2010", "2011"];
      default:
        break;
    }
  }

  private fakeSearch3(level1: string, level2: string): string[] {
    switch (level1) {
      case "EB - Policy":
        return ["Product 1", "Product 2", "Product 3", "Product 4", "Medical Underwriting", "Servicing"];
      case "EB - Existing Business/Servicing – Credit Control":
        return ["Document Type 1", "Document Type 2", "Document Type 3"];
      case "EB - New Business Active Quotes":
        return ["0##Title 0##fieldStr 0##fieldInt 0", "1##Title 1##fieldStr 1##fieldInt 1"];
      case "EB - New Business Archive Quotes":
        return ["2##Title 2##fieldStr 2##fieldInt 2", "3##Title 3##fieldStr 3##fieldInt 3", "4##Title 4##fieldStr 4##fieldInt 4"];
      case "EB - Business Development":
        return ["5##Title 5##fieldStr 5##fieldInt 5", "6##Title 6##fieldStr 6##fieldInt 6"];
      case "EB - Documents in Transit":
        return ["WorkReference 1", "WorkReference 2", "WorkReference 3"];
      case "EB - Documents in Transit (deleted)":
        return ["WorkReference 4", "WorkReference 5", "WorkReference 6", "WorkReference 7", "WorkReference 8"];
      case "EB - Payment Letters":
        return ["Jan", "Feb", "Mar", "Apr", "May"];
      case "EB - General Queries":
        return ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      default:
        break;
    }
  }

  private fakeSearch4(level1: string, level2: string, level3: string, level3type: string): string[] {
    switch (level1) {
      case "EB - Policy":
        if (level3 == "Medical Underwriting")
          return ["Member Name - MUWID 1", "Member Name - MUWID 2", "Member Name - MUWIDm 3", "Member Name - MUWIDm 4", "Member Name - MUWIDm 5", "Member Name - MUWIDm 6", "Member Name - MUWIDm 7"];
        if (level3 == "Servicing")
          return ["Document Type 1", "Document Type 2", "Document Type 3", "Document Type 4", "Document Type 5"];
        // for products
        return ["Claim Number - Claimant Name 1", "Claim Number - Claimant Name 2", "Claim Number - Claimant Name 3", "Claim Number - Claimant Name 4", "Claim Number - Claimant Name 5", "Claim Number - Claimant Name 6"];
      case "EB - Existing Business/Servicing – Credit Control":
        return ["5##Title 5##fieldStr 5##fieldInt 5", "6##Title 6##fieldStr 6##fieldInt 6"];
      // case "EB - New Business Quotes":
      //   return ["DOCUMENT LIST"];
      // case "EB - Business Development":
      //   return ["DOCUMENT LIST"];
      case "EB - Documents in Transit":
        return ["7##Title 7##fieldStr 7##fieldInt 7", "8##Title 8##fieldStr 8##fieldInt 8"];
      case "EB - Documents in Transit (deleted)":
        return ["9##Title 9##fieldStr 9##fieldInt 9"];
      case "EB - Payment Letters":
        return ["Document Type 6", "Document Type 7", "Document Type 8"];
      case "EB - General Queries":
        return ["9##Title 9##fieldStr 9##fieldInt 9"];
      default:
        break;
    }
  }





  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
