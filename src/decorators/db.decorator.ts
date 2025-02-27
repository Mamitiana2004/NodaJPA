import 'reflect-metadata';

export function Table(tableName: string) {
    return function (constructor: Function) {
        Reflect.defineMetadata('tableName', tableName, constructor);
    };
}

export function Column(options: {
    name: string; 
    primary_key?: boolean; 
    autoincrement?: boolean;
    unique?: boolean; 
}) {
    return function (target: any, propertyKey: any) {
        const columns = Reflect.getMetadata('columns', target.constructor) || [];
        const columnOption = {
            primary_key: false,
            autoincrement: false,
            unique: false,
            ...options
        }
        columns.push({ propertyKey, ...columnOption });
        Reflect.defineMetadata('columns', columns, target.constructor);
    };
}