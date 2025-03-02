export interface ColumnMetaData {
    propertyKey: string;
    name: string;
    primary_key ?: boolean;
    autoincrement ?: boolean;
    unique ?: boolean;
}

export interface OneToManyMetaData {
    joinColumn:string;
    entity:Function
} 

export interface ManyToOneMetaData {
    joinColumn:string;
    entity:Function
} 

export interface TableMetadata {
    table: string;
    columns: ColumnMetaData[]; 
    oneToManyRelations : OneToManyMetaData[],
    manyToOneRelations : ManyToOneMetaData[]
}