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
import { IDetailsListBasicItem, ISearchParams } from './components/IInterfaces';
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
        displayMode: this.displayMode,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private getParameterByName(name: string, url: string): string {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    var results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  private getQueryParameters(url: string, filters?: string[]): ISearchParams[] {
    let params = new URLSearchParams(url);
    let paramObj: ISearchParams[] = [];
    params.forEach(function (value, key) {
      paramObj.push({ name: key, value: value });
    });

    if (filters) {
      paramObj = paramObj.filter(el => filters.indexOf(el.name) > -1);
    }

    return paramObj;
  }

  private _getLinks(): IDetailsListBasicItem[] {
    let items: IDetailsListBasicItem[] = [];
    let search: string = window.location.search;
    let paramObj: ISearchParams[] = this.getQueryParameters(search, ["level1", "level2", "level3", "level4", "level5", "level6"]);

    switch (paramObj.length) {
      case 0:
        items = this.getLinksLv1();
        break;
      case 1:
        items = this.getLinksLv2(paramObj[0].value);
        break;
      case 2:
        items = this.getLinksLv3(paramObj[0].value, paramObj[1].value);
        break;
      default:
        break;
    }

    return items;
  }

  private getLinksLv1(): IDetailsListBasicItem[] {
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
    return items;
  }

  private getLinksLv2(level1: string): IDetailsListBasicItem[] {
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
    return items;
  }

  private getLinksLv3(level1: string, level2: string): IDetailsListBasicItem[] {
    let items: IDetailsListBasicItem[] = [];
    let resultsFromSearch: string[] = this.fakeSearch3(level1, level2);
    let index: number = 0;
    resultsFromSearch.forEach(element => {
      //TODO chiedere a marco il valore di level3type per servicing (da aggiornare excel)
      let level3Type: string = level2 == "Medical Underwriting" ? "Category" :
        level2 == "Servicing" ? "Servicing" : "Product"
      items.push({
        key: index,
        name: element,
        value: `?level1=${level1}&level2=${level2}&level3=${element}&level3type=${level3Type}`
      });
    });
    return items;
  }

  private fakeSearch1(filters: string): string[] {
    return ["EB - Policy", "EB - Existing Business/Servicing – Credit Control", "EB - New Business Quotes", "EB - Business Development",
      "EB - Documents in Transit", "EB - Payment Letters", "EB - General Queries"];
  }

  private fakeSearch2(level1: string): string[] {
    switch (level1) {
      case "EB - Policy":
        return ["Policy Number - Company Name 1", "Policy Number - Company Name 2", "Policy Number - Company Name 3"];
      case "EB - Existing Business/Servicing – Credit Control":
        return ["Payment Type 1", "Payment Type 2", "Payment Type 3"];
      case "EB - New Business Quotes":
        return ["Work Reference – Quote Reference - Company 1", "Work Reference – Quote Reference - Company 2", "Work Reference – Quote Reference - Company 3", "Work Reference – Quote Reference - Company 4"];
      case "EB - Business Development":
        return ["Company 1", "Company 2"];
      case "EB - Documents in Transit":
        return ["Department 1", "Department 2", "Department 3"];
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
      case "EB - New Business Quotes":
        return ["Active 1", "Active 2", "Active 3", "Active 4", "Active 5", "Active 6"];
      case "EB - Business Development":
        return ["DOCUMENT LIST"];
      case "EB - Documents in Transit":
        return ["WorkReference 1", "WorkReference 2", "WorkReference 3"];
      case "EB - Payment Letters":
        return ["Jan", "Feb", "Mar", "Apr", "May"];
      case "EB - General Queries":
        return ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
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
