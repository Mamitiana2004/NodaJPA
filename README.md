# 🚀 NodaJPA - Un ORM inspiré de JPA pour Node.js



NodaJPA est une implémentation inspirée de JPA en Java, permettant une gestion fluide et intuitive des bases de données relationnelles avec Node.js.

## 🎯 Fonctionnalités

✅ **Mapping des entités** comme en JPA\
✅ **Requêtes simplifiées** avec un Entity Manager\
✅ **Support multi-base de données** (PostgreSQL)\
✅ **TypeScript supporté**\
✅ **Gestion des migrations**

---

## 📦 Installation

```sh
npm install nodajpa
```

### 📌 Configuration de la base de données

Après l'installation, configurez votre environnement `.env` dans votre projet avec les informations suivantes :

```
NODAJPA_HOST=localhost
NODAJPA_PORT=5432
NODAJPA_USER=postgres
NODAJPA_PASSWORD=pass
NODAJPA_NAME=test_nodajpa
```

⚠️ **Actuellement, NodaJPA ne supporte que PostgreSQL. D'autres bases de données seront ajoutées prochainement.**

---

## 🚀 Utilisation

### 1️⃣ Définir une entité

```ts
import { Column, Entity, ManyToOne, Table } from "nodajpa";


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


    @Column()
    identifiant: string;

    // JoinColumn est le nom de la foreign Key
    // entity est la classe Entity dont la foreign key fait references
    @ManyToOne({joinColumn:"id_genre",entity:Genre})
    genre:Genre;

    @Column()
    password: string;

    constructor(id: number, identifiant: string, password: string,genre:Genre) {
        super();
        this.genre = genre ?? null;
        this.id = id ?? 0;
        this.identifiant = identifiant ?? '';
        this.password = password ?? '';
    }
}
```

### 2️⃣ Configurer la connexion

Après l'installation, configurez votre environnement `.env` dans votre projet avec les informations suivantes :

```
NODAJPA_HOST=localhost
NODAJPA_PORT=5432
NODAJPA_USER=postgres
NODAJPA_PASSWORD=pass
NODAJPA_NAME=test_nodajpa
```

⚠️ **Actuellement, NodaJPA ne supporte que PostgreSQL. D'autres bases de données seront ajoutées prochainement.**

### 3️⃣ CRUD avec l’Entity Manager

#### 🔍 Récupérer toutes les entrées

```ts
const users = await User.getAll();
console.log(users);
```

**Resultat**

    [
        [class User extends Entity]{
            id: 1,
            identifiant: 'jean',
            password: 'jean1234',
            genre: [class Genre extends Entity] { 
                id: 1, 
                nom: 'm' 
            }
        },
        [class User extends Entity]{
            id: 2,
            identifiant: 'jeanne',
            password: 'jeanne564',
            genre: [class Genre extends Entity] { 
                id: 2, 
                nom: 'f' 
            }
        }
    ]

#### 🔍 Récupérer une entrée par clé primaire

```ts
const user = await User.getByPrimaryKey(1);
console.log(user);
```

**resultat**

    [class User extends Entity]{
        id: 1,
        identifiant: 'jean',
        password: 'jean1234',
        genre: [class Genre extends Entity] { 
            id: 1, 
            nom: 'm' 
        }
    }

#### 🔄 Sauvegarder une nouvelle entrée

```ts
const newUser = new User(0, "JohnDoe", "password123");
await newUser.save();
```

#### ✏️ Mettre à jour une entrée

```ts
newUser.password = "newSecurePassword";
await newUser.update();
```

#### ❌ Supprimer une entrée

```ts
await newUser.delete();
```

#### 🏗️ Exécuter une requête personnalisée

```ts
await User.executeQuery("UPDATE utilisateur SET password = $1 WHERE identifiant = $2", "securePass", "JohnDoe");
```

---

## 🏗️ Architecture

📌 **Entity Manager** - Gestion des entités et des transactions\
📌 **Repositories** - CRUD simplifié pour chaque entité\


---

## 📜 Roadmap

-

🚧 **Le projet est encore en plein développement. De nouvelles fonctionnalités seront ajoutées prochainement !** 🚧

---

## 📄 Licence

Ce projet est sous licence **MIT**.

📌 **Auteur** : [Mamitiana Faneva](https://mamitiana-faneva.pages.dev/)

📢 **Contributions bienvenues !** 🚀

