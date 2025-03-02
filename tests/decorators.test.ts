// tests/decorators.test.ts

import { Column, Entity, ManyToOne, OneToMany, Table } from "../src";

@Table("genre")
class Genre extends Entity{
    @Column({primary_key:true,autoincrement:true})
    id:number;

    @Column()
    nom:string;

    constructor(id:number,nom:string){
        super();
        this.id = id;
        this.nom= nom;
    }
}

@Table('utilisateur')
class User extends Entity {
    @Column({ name: 'id', primary_key: true, autoincrement: true })
    id: number;


    @Column({ name: 'identifiant' })
    identifiant: string;

    @ManyToOne({joinColumn:"genre",entity:Genre})
    genre:Genre;

    @Column({ name: "password" })
    password: string;

    constructor(id: number, identifiant: string, password: string,genre:Genre) {
        super();
        this.genre = genre ?? null;
        this.id = id ?? 0;
        this.identifiant = identifiant ?? '';
        this.password = password ?? '';
    }
}

describe('Table Decorator', () => {
    it('should add table metadata to the class', async () => {
        const users : User = await User.getByPrimaryKey<User>(1);
        console.log(users);
        expect(User.prototype instanceof Entity).toBe(true);
    });
});