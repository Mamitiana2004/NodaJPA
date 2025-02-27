import 'reflect-metadata';
import { ColumnMetaData, TableMetadata } from '../interfaces/db.metadata';

export const getTableName = (constructor: Function): string => {
    const tableName = Reflect.getMetadata('tableName', constructor);
    if (!tableName) {
        throw new Error("Table not found");
    }
    return tableName;
}

export const getTableStructure = (constructor: Function): TableMetadata => {

    const tableName = Reflect.getMetadata('tableName', constructor);
    if (!tableName) {
        throw new Error('Table name not found');
    }

    const columns = Reflect.getMetadata('columns', constructor) || [];

    return {
        table: tableName,
        columns: columns,
    };
}

export const getAllColumnAutoIncrement = (constructor: Function): ColumnMetaData[] => {
    const tableStructure = getTableStructure(constructor);

    return tableStructure.columns.filter((column) => column.autoincrement);
}

export const getPrimaryKey = (constructor: Function): ColumnMetaData => {

    const tableStructure = getTableStructure(constructor);

    const primaryKeyColumns = tableStructure.columns.filter((column) => column.primary_key);

    if (primaryKeyColumns.length === 0) {
        throw new Error('No primary key found');
    }
    if (primaryKeyColumns.length > 1) {
        throw new Error('More than one primary key found');
    }

    return primaryKeyColumns[0];
}