import * as React from 'react';
import { IBreadcrumbNavTestProps } from './IBreadcrumbNavTestProps';
import { Breadcrumb, IBreadcrumbItem } from 'office-ui-fabric-react/lib/Breadcrumb';
import { Label, ILabelStyles } from 'office-ui-fabric-react/lib/Label';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { ITextFieldStyles } from 'office-ui-fabric-react/lib/TextField';
import { DetailsList, DetailsListLayoutMode, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';
import { Logger, ConsoleListener, LogLevel } from "@pnp/logging";
import { IDetailsListBasicItem } from './IInterfaces';

// subscribe a listener
Logger.subscribe(new ConsoleListener());
// set the active log level
Logger.activeLogLevel = LogLevel.Info;



const labelStyles: Partial<ILabelStyles> = {
  root: { margin: '10px 0', selectors: { '&:not(:first-child)': { marginTop: 24 } } },
};

const itemsWithHref: IBreadcrumbItem[] = [
  // Normally each breadcrumb would have a unique href, but to make the navigation less disruptive
  // in the example, it uses the breadcrumb page as the href for all the items
  { text: 'EB - Policy', key: 'lv1', href: '#' },
  { text: 'Policy Number - Company Name', key: 'lv2', href: '?level1=EB - Policy', isCurrentItem: true }
];

export interface IBreadcrumbNavTestState {
  breadcrumbItems: IBreadcrumbItem[];
  items: IDetailsListBasicItem[];
  columns: IColumn[];
}

export default class BreadcrumbNavTest extends React.Component<IBreadcrumbNavTestProps, IBreadcrumbNavTestState, {}> {
  constructor(props: IBreadcrumbNavTestProps) {
    super(props);
    let _columns: IColumn[] = [
      { key: 'Name', name: 'Name', fieldName: 'name', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'Value', name: 'Value', fieldName: 'value', minWidth: 100, maxWidth: 200, isResizable: true },
    ];
    this.state = {
      breadcrumbItems: [],
      items: [],
      columns: _columns
    };
  }

  public async componentDidMount() {
    try {
      let _columns: IColumn[] = [
        { key: 'Name', name: 'Name', fieldName: 'name', minWidth: 100, maxWidth: 200, isResizable: true },
        { key: 'Value', name: 'Value', fieldName: 'value', minWidth: 100, maxWidth: 200, isResizable: true },
      ];
      // Populate with items for demos.
      let _allItems: IDetailsListBasicItem[] = this._getLinks();
      let _breadcrumbItems: IBreadcrumbItem[] = this._getBreadCrumbItems();

      this.setState({ items: _allItems, columns: _columns, breadcrumbItems: _breadcrumbItems });
    }
    catch (error) {
      Logger.write(`componentDidMount - Error found Loading 'BreadcrumbNavTest' web part. Message: ${error.message}`, LogLevel.Error);
    }
  }

  public render(): React.ReactElement<IBreadcrumbNavTestProps> {
    return (
      <div>
        {this.props.displayMode == 2 &&
          <h1>BreadcrumbNavTest WebPart</h1>
        }
        {this.props.displayMode == 1 &&
          <div>
            <Label styles={labelStyles}>With items rendered as links</Label>
            <Breadcrumb
              items={this.state.breadcrumbItems}
              maxDisplayedItems={6}
              ariaLabel="Breadcrumb with items rendered as links"
              overflowAriaLabel="More links"
            />
            <Fabric>
              <DetailsList
                items={this.state.items}
                columns={this.state.columns}
                setKey="set"
                layoutMode={DetailsListLayoutMode.justified}
                selectionPreservedOnEmptyClick={true}
                onRenderItemColumn={this._renderItemColumn.bind(this)}
                ariaLabelForSelectionColumn="Toggle selection"
                ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                checkButtonAriaLabel="Row checkbox"
              />
            </Fabric>
          </div>
        }
      </div>
    );
  }

  private _renderItemColumn(item: IDetailsListBasicItem, index: number, column: IColumn) {
    const fieldContent = item[column.fieldName as keyof IDetailsListBasicItem] as string;
    switch (column.key) {
      case 'Name':
        // const fieldContent = item["name" as keyof IDetailsListBasicItem] as string;
        const fieldValue = item["value"] as string;
        return <Link href={fieldValue} onClick={this._getLinks.bind(this)}>{fieldContent}</Link>;
      default:
        // const fieldContent = item["name" as keyof IDetailsListBasicItem] as string;
        return <span>{fieldContent}</span>;
    }
  }

  private _getLinks(): IDetailsListBasicItem[] {
    let results: IDetailsListBasicItem[] = this.props.getLinks();
    return results;
  }

  private _getBreadCrumbItems(): IBreadcrumbItem[] {
    let results: IBreadcrumbItem[] = this.props.getBreadCrumbItems();
    return results;
  }

}