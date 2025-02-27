import { Column, Entity, Table } from "../src";

@Table('utilisateur')
class User extends Entity {
    @Column({ name: 'id', primary_key: true, autoincrement: true })
    id: number;

    @Column({ name: 'identifiant' })
    identifiant: string;

    @Column({ name: "password" })
    password: string;

    constructor(id: number, identifiant: string, password: string) {
        super();
        this.id = id ?? 0;
        this.identifiant = identifiant ?? '';
        this.password = password ?? '';
    }
}

describe('Table Decorator', () => {
    it('should add table metadata to the class', async () => {
        const user : User = new User(1,'admin','adkpqkdpq');
        
        expect(User.prototype instanceof Entity).toBe(true);
    });
});