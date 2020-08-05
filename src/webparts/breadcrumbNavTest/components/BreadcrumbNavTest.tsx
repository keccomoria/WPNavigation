import * as React from 'react';
import { IBreadcrumbNavTestProps } from './IBreadcrumbNavTestProps';
import { Breadcrumb, IBreadcrumbItem } from 'office-ui-fabric-react/lib/Breadcrumb';
import { Label, ILabelStyles } from 'office-ui-fabric-react/lib/Label';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { ITextFieldStyles } from 'office-ui-fabric-react/lib/TextField';
import { DetailsList, DetailsListLayoutMode, IColumn, SelectionMode } from 'office-ui-fabric-react/lib/DetailsList';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';
import { Logger, ConsoleListener, LogLevel } from "@pnp/logging";
import { IDetailsListBasicItem, IDetailsListContent, IDetailsListDocumentItem } from './IInterfaces';

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
  items: IDetailsListBasicItem[] | IDetailsListDocumentItem[];
  typeOfItems: number;
  columns: IColumn[];
}

export default class BreadcrumbNavTest extends React.Component<IBreadcrumbNavTestProps, IBreadcrumbNavTestState, {}> {
  constructor(props: IBreadcrumbNavTestProps) {
    super(props);
    this.state = {
      breadcrumbItems: [],
      items: [],
      typeOfItems: 0,
      columns: []
    };
  }

  public async componentDidMount() {
    try {
      // let _columns: IColumn[] = [
      //   { key: 'Name1', name: 'Name1', fieldName: 'name', minWidth: 100, maxWidth: 200, isResizable: true },
      //   { key: 'Name', name: 'Name', fieldName: 'name', minWidth: 100, maxWidth: 200, isResizable: true },
      //   { key: 'Value', name: 'Value', fieldName: 'value', minWidth: 100, maxWidth: 200, isResizable: true },
      // ];

      // Populate with items for demos.
      let _detailsListContent: IDetailsListContent = this._getLinks();
      let _allItems: IDetailsListBasicItem[] | IDetailsListDocumentItem[] = _detailsListContent.content;
      let _typeOfItems: number = _detailsListContent.type;
      let _breadcrumbItems: IBreadcrumbItem[] = this._getBreadCrumbItems();
      let _columns: IColumn[] = this._getColumnsByTypeOfItems(_typeOfItems);

      this.setState({ items: _allItems, columns: _columns, breadcrumbItems: _breadcrumbItems, typeOfItems: _typeOfItems });
    }
    catch (error) {
      Logger.write(`componentDidMount - Error found Loading 'BreadcrumbNavTest' web part. Message: ${error.message}`, LogLevel.Error);
    }
  }

  private _getColumnsByTypeOfItems(typeOfItems: number): IColumn[] {
    let _columns: IColumn[] = null;
    switch (typeOfItems) {
      case 0:
        _columns = [{ key: 'Name', name: 'Name', fieldName: 'name', minWidth: 100, maxWidth: 200, isResizable: true }];
        break;
      case 1:
        _columns = [
          { key: 'Id', name: 'Id', fieldName: 'id', minWidth: 100, maxWidth: 200, isResizable: true },
          { key: 'Title', name: 'Title', fieldName: 'title', minWidth: 100, maxWidth: 200, isResizable: true },
          { key: 'FieldStr', name: 'FieldStr', fieldName: 'fieldStr', minWidth: 100, maxWidth: 200, isResizable: true },
          { key: 'FieldInt', name: 'FieldInt', fieldName: 'fieldInt', minWidth: 100, maxWidth: 200, isResizable: true }
        ];
        break;
      default:
        break;
    }
    return _columns;
  }

  public render(): React.ReactElement<IBreadcrumbNavTestProps> {
    return (
      <div>
        {this.props.displayMode == 2 &&
          <h1>BreadcrumbNavTest WebPart</h1>
        }
        {this.props.displayMode == 1 &&
          <div>
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
                selectionMode={SelectionMode.none}
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
        const fieldValue = item["value"] as string;
        // return <Link onClick={this._getLinks.bind(this)}>{fieldContent}</Link>;
        return <Link data-interception="off" href={fieldValue}>{fieldContent}</Link>;
      default:
        return <span>{fieldContent}</span>;
    }
  }

  private _getLinks(): IDetailsListContent {
    let results: IDetailsListContent = this.props.getLinks();
    return results;
  }

  private _getBreadCrumbItems(): IBreadcrumbItem[] {
    let results: IBreadcrumbItem[] = this.props.getBreadCrumbItems();

    results.forEach(breadcrumbItem => {
      breadcrumbItem.onClick = this._onBreadcrumbItemClicked.bind(this);
    });
    // the last navigation item should be not clickable
    results[results.length - 1].onClick = null;

    return results;
  }

  private _onBreadcrumbItemClicked(ev: React.MouseEvent<HTMLElement>, item: IBreadcrumbItem): void {
    this.props._onBreadcrumbItemClicked(ev, item);
  }

  private _isDocumentList = (x: any): x is IDetailsListDocumentItem[] => true;

}