export interface TableData {
  headers: string[];
  items: string[][];
  routerLinkPaths: string[];
  emptyTableMessage: string;
  deletePaths?: string[];
  columnWidth?: Map<number, number>;
  editAction: boolean;
  deleteAction: boolean;
  clickableRows?: boolean;
  pageTable?: boolean;
}
