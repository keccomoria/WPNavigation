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
import { IDetailsListBasicItem } from './components/IDetailsListBasicItem';
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


  private _getLinks(): IDetailsListBasicItem[] {
    let items: IDetailsListBasicItem[] = [];
    items.push(
      {
        key: 0,
        name: 'EB - Policy',
        value: '?level1=EB - Policy',
      },
      {
        key: 1,
        name: 'EB - Existing Business/Servicing – Credit Control',
        value: '?level1=EB - Existing Business/Servicing – Credit Control',
      }
    );
    return items;
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
