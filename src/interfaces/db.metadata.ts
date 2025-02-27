export interface ColumnMetaData {
    propertyKey: string;
    name: string;
    primary_key ?: boolean;
    autoincrement ?: boolean;
    unique ?: boolean;
}

export interface TableMetadata {
    table: string;
    columns: ColumnMetaData[]; 
}