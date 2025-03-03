import { getPrimaryKey, getTableName, getTableStructure } from "./db_decorator.process"

export const getAllSQL = (constructor: Function): string => {
    const tableName = getTableName(constructor);
    const query = `SELECT * FROM ${tableName}`;
    return query;
}

export const getByPrimaryKeySQL = (constructor: Function, value: any): string => {
    const tableName = getTableName(constructor);
    const primary_key = getPrimaryKey(constructor);
    const query = `SELECT * FROM ${tableName} WHERE ${primary_key.name} = ${value}`;
    return query;
}

export const countSQL = (constructor: Function): string => {
    const tableName = getTableName(constructor);
    const query = `SELECT count(*) FROM ${tableName}`;
    return query;
}

export const insertSQL = (constructor: Function): string => {
    const tableStructure = getTableStructure(constructor);
    const tableName = tableStructure.table;
    const columns = tableStructure.columns;
    const manyColumns = tableStructure.manyToOneRelations;
    const insertColumns = columns.filter((column) => !column.autoincrement);
    const columnNames = insertColumns.map((column) => column.name).join(', ');
    const columnValues = insertColumns.map((column) => (this as any)[column.propertyKey]);
    const qurey = `
        INSERT INTO ${tableName} (${columnNames})
        VALUES (${columnValues.map((_, index) => `$${index + 1}`).join(', ')})
    `;
    return qurey;

}

export const updateSQL = (constructor: Function): string => {
    const tableStructure = getTableStructure(constructor);
    const tableName = tableStructure.table;
    const pkColumn = getPrimaryKey(constructor);
    const columns = tableStructure.columns;
    const updateColumn = columns.filter((column) => !column.primary_key);
    const query = `UPDATE ${tableName} SET ${updateColumn.map((column, index) => {
        if (index == 0) {
            return (`${column.name} = $${index + 1}`);
        }
        else {
            return (`${column.name} = $${index + 1}`);
        }
    })} WHERE ${pkColumn.name} = $${updateColumn.length + 1}`;
    return query;
}

export const updateAllSQL = (constructor: Function): string => {
    const tableStructure = getTableStructure(constructor);
    const tableName = tableStructure.table;
    const columns = tableStructure.columns;
    const updateColumn = columns.filter((column) => !column.primary_key);
    const query = `UPDATE ${tableName} SET ${updateColumn.map((column, index) => {
        if (index == 0) {
            return (`${column.name} = $${index + 1}`);
        }
        else {
            return (`${column.name} = $${index + 1}`);
        }
    })}`;
    return query;
}

export const deleteSQL = (constructor: Function): string => {
    const tableStructure = getTableStructure(constructor);
    const tableName = tableStructure.table;
    const pkColumn = getPrimaryKey(constructor);
    const query = `DELETE FROM ${tableName} WHERE ${pkColumn.name}= ${pkColumn.propertyKey}`;
    return query;
}

export const deleteAllSQL = (constructor: Function): string => {
    const tableName = getTableName(constructor);
    return `DELETE FROM ${tableName}`;
}

export const getBySQL = (constructor: Function, ...columns: string[]): string => {
    if (columns.length === 0) {
        return getAllSQL(constructor);
    }
    const tableStructure = getTableStructure(constructor);
    const tableName = tableStructure.table;
    const query = `SELECT * FROM ${tableName} WHERE ${columns.map((column, index) => {
        if (index == 0) {
            return (`${column} = $${index + 1}`)
        }
        else {
            return (`AND ${column} = $${index + 1}`)
        }
    }).join(" ")}`;
    return query;
}

export const updateBySQL = (constructor: Function, ...columnNames: string[]): string => {
    if (columnNames.length === 0) {
        return updateAllSQL(constructor);
    }
    const tableStructure = getTableStructure(constructor);
    const tableName = tableStructure.table;
    const columns = tableStructure.columns;
    const updateColumn = columns.filter((column) => !column.primary_key);

    const setClause = updateColumn.map((column, index) => `${column.name} = $${index + 1}`).join(', ');
    const whereClause = columnNames.map((column, index) => {
            const paramIndex = index + updateColumn.length + 1; // Calculer l'index correct
            return `${column} = $${paramIndex}`;
        }).join(' AND ');

    const query = `UPDATE ${tableName} SET ${setClause} WHERE ${whereClause}`;
    return query;
}