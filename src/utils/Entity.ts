import DBConfig from "../config/db.config";
import { TableMetadata } from "../interfaces/db.metadata";
import { getPrimaryKey, getTableStructure } from "./db_decorator.process";
import { countSQL, deleteAllSQL, deleteSQL, getAllSQL, getByPrimaryKeySQL, getBySQL, insertSQL, updateBySQL, updateSQL } from "./generator.process";

export abstract class Entity {

    static getTableMetadata(): TableMetadata {
        return getTableStructure(this);
    }

    static async mapDataToEntity<T extends Entity>(data: Record<string, any>): Promise<T> {
        const entity = this as unknown as T;
        const columns = this.getTableMetadata().columns || [];
        const manyToOneRelations = this.getTableMetadata().manyToOneRelations || [];
        const oneToManyRelations = this.getTableMetadata().oneToManyRelations || [];


        // Mapping des colonnes simples
        columns.forEach((column: any) => {
            const value = data[column.name];
            if (value !== undefined) {
                (entity as any)[column.propertyKey] = value;
            }
        });

        if (manyToOneRelations.length !== 0) {
            await Promise.all(
                manyToOneRelations.map(async (manyToOneRelation: any) => {
                    const joinColumn = manyToOneRelation.joinColumn;
                    const joinColumnValue = data[joinColumn];
                    const relationEntity = manyToOneRelation.entity;


                    if (joinColumnValue !== null && joinColumnValue !== undefined) {
                        try {
                            const dataEntities = await relationEntity.getByPrimaryKey(joinColumnValue);
                            if (dataEntities) {
                                const relatedEntities = await relationEntity.mapDataToEntity(dataEntities);
                                (entity as any)[manyToOneRelation.propertyKey] = relatedEntities;
                            }
                        } catch (error) {
                            console.error(`Erreur lors du chargement de la relation manytoOne (${manyToOneRelation.propertyKey}):`, error);
                        }
                    }
                }));
        }

        if (oneToManyRelations.length !== 0) {

            await Promise.all(
                oneToManyRelations.map(async (oneToManyRelation: any) => {
                    const joinColumn = oneToManyRelation.joinColumn;
                    const pkColumn = getPrimaryKey(this);
                    const joinColumnValue = data[pkColumn.propertyKey];

                    const relationEntity = oneToManyRelation.entity;

                    if (joinColumnValue !== null && joinColumnValue !== undefined) {
                        try {
                            const dataEntities = await relationEntity.getAllByForeignKey(joinColumn, joinColumnValue);
                            if (dataEntities) {
                                const relatedEntities = await relationEntity.mapDataToEntity(dataEntities);
                                (entity as any)[oneToManyRelation.propertyKey] = relatedEntities;
                            }
                        } catch (error) {
                            console.error(`Erreur lors du chargement de la relation OneToMany (${oneToManyRelation.propertyKey}):`, error);
                        }
                    }
                }))
        }



        return entity;
    }

    static async getAllByForeignKey<T extends Entity>(foreignKeyColumn: string, foreignKeyValue: any): Promise<T[]> {
        const tableName = this.getTableMetadata().table;
        const pool = await DBConfig.createInstance();
        const query = `SELECT * FROM ${tableName} WHERE ${foreignKeyColumn} = $1`;

        const { rows } = await pool.query(query, [foreignKeyValue]);

        if (rows.length === 0) {
            return [];
        }

        return Promise.all(rows.map(async (row) => await this.mapDataToEntity(row) as unknown as T));
    }


    static async count(): Promise<number> {
        const pool = await DBConfig.createInstance();
        const query = countSQL(this);
        const { rows } = await pool.query(query);
        if (rows.length === 0) {
            return 0;
        }
        return rows[0];
    }

    static async getAll<T extends Entity>(): Promise<T[]> {
        const pool = await DBConfig.createInstance();
        const query = getAllSQL(this);
        const { rows } = await pool.query(query);
        if (rows.length === 0) {
            return [];
        }
        return Promise.all(rows.map(async (row) => await this.mapDataToEntity(row) as unknown as T));
    }


    async get<T extends Entity>(...columnNames: string[]): Promise<T[]> {
        const pool = await DBConfig.createInstance();
        const tableStructure = getTableStructure(this.constructor);
        const allColumns = tableStructure.columns;
        const entityClass = this.constructor as typeof Entity;
        const columns = allColumns.filter((column) => columnNames.includes(column.name));
        if (columns.length === 0) {
            return entityClass.getAll();
        }
        const query = getBySQL(this.constructor, ...columnNames);
        const columnValues = columns.map((column) => (this as any)[column.propertyKey]);
        const { rows } = await pool.query(query, columnValues);
        return rows.map((row) => entityClass.mapDataToEntity(row) as unknown as T);
    }

    static async getByPrimaryKey<T extends Entity>(value: any): Promise<T> {
        const pool = await DBConfig.createInstance();
        const query = getByPrimaryKeySQL(this, value);
        const { rows } = await pool.query(query);
        return this.mapDataToEntity(rows[0]) as unknown as T;
    }

    async save(): Promise<void> {
        const pool = await DBConfig.createInstance();
        const columns = (this.constructor as typeof Entity).getTableMetadata().columns;
        const insertColumns = columns.filter((column) => !column.autoincrement);
        const columnValues = insertColumns.map((column) => (this as any)[column.propertyKey]);
        const query = insertSQL(this.constructor);
        await pool.query(query, columnValues);
    }

    async update(): Promise<void> {
        const pool = await DBConfig.createInstance();
        const columns = (this.constructor as typeof Entity).getTableMetadata().columns;
        const updateColumn = columns.filter((column) => !column.primary_key);
        const primary_key = getPrimaryKey(this.constructor as typeof Entity);
        const columnUpdated = updateColumn;
        columnUpdated.push(primary_key);
        const columnValues = columnUpdated.map((column) => (this as any)[column.propertyKey]);
        const query = updateSQL(this.constructor);
        await pool.query(query, columnValues);
    }

    static async updateAll(): Promise<void> {
        const pool = await DBConfig.createInstance();
        const query = updateSQL(this.constructor);
        await pool.query(query);
    }

    async updateBy(...columnNames: string[]): Promise<void> {
        const pool = await DBConfig.createInstance();
        const tableStructure = getTableStructure(this.constructor);
        const allColumns = tableStructure.columns;
        const entityClass = this.constructor as typeof Entity;
        const columnsToUpdate = allColumns.filter((column) => columnNames.includes(column.name));
        if (columnsToUpdate.length === 0) {
            await entityClass.updateAll();
            return;
        }
        const columnValues = columnNames.map((column) => (this as any)[column])
        const query = updateBySQL(this.constructor, ...columnNames);
        const conditionValues = columnNames.map((column) => (this as any)[column]);
        const values = [...columnValues, ...conditionValues];
        await pool.query(query, values);
    }

    async delete(): Promise<void> {
        const pool = await DBConfig.createInstance();
        const query = deleteSQL(this.constructor);
        await pool.query(query);
    }

    static async deleteAll(): Promise<void> {
        const pool = await DBConfig.createInstance();
        const query = deleteAllSQL(this.constructor);
        await pool.query(query);
    }


    static async executeQuery(query: string, ...data: any[]): Promise<any> {
        const pool = await DBConfig.createInstance();
        if (data.length === 0) {
            await pool.query(query);
            return;
        }
        await pool.query(query, data);
    }
}