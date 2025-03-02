import 'reflect-metadata';
import { Entity } from '../utils/Entity';

export function Table(tableName: string) {
    return function (constructor: Function) {
        Reflect.defineMetadata('tableName', tableName, constructor);
    };
}

export function Column(options?: {
    name?: string;
    primary_key?: boolean;
    autoincrement?: boolean;
    unique?: boolean;
}) {
    return function (target: any, propertyKey: any) {
        const columns = Reflect.getMetadata('columns', target.constructor) || [];
        const columnNames = options?.name || propertyKey;
        const columnOption = {
            name:columnNames,
            primary_key: false,
            autoincrement: false,
            unique: false,
            ...options
        }
        columns.push({ propertyKey, ...columnOption });
        Reflect.defineMetadata('columns', columns, target.constructor);
    };
}

export function OneToMany(options: {
    joinColumn: string,
    entity:Function
}) {
    return function (target: any, propertyKey: any) {
        const relations = Reflect.getMetadata("onetomany", target.constructor) || [];
        const targetEntity = options.entity;
        if (targetEntity instanceof Entity) {
            throw new Error(`The entity in the oneTomany ${propertyKey} must inherit from Entity`)
        }
        relations.push({ propertyKey, ...options });
        Reflect.defineMetadata("onetomany",relations,target.constructor);
    }
}

export function ManyToOne(options:{
    joinColumn:string,
    entity:Function
}){
    return function (target:any,propertyKey:any){
        const relations = Reflect.getMetadata("manytoone",target.constructor) || [];
        const targetEntity = options.entity;
        if (targetEntity instanceof Entity) {
            throw new Error(`The entity in the manytoone ${propertyKey} must inherit from Entity`)
        }
        relations.push({propertyKey,...options});
        Reflect.defineMetadata("manytoone",relations,target.constructor);
    }
}