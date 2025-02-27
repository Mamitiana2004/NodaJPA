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

Après l'installation, vous devez créer un fichier `database.config` dans la racine de votre projet avec les informations suivantes :

```
user=postgres
password=pass
database=tdr
host=localhost
port=5432
```

⚠️ **Actuellement, NodaJPA ne supporte que PostgreSQL. D'autres bases de données seront ajoutées prochainement.**

---

## 🚀 Utilisation

### 1️⃣ Définir une entité

```ts
import { Column, Entity, Table } from "nodajpa";

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
```

### 2️⃣ Configurer la connexion

Après l'installation, vous devez créer un fichier `database.config` dans la racine de votre projet avec les informations suivantes :

```
user=postgres
password=pass
database=tdr
host=localhost
port=5432
```

⚠️ **Actuellement, NodaJPA ne supporte que PostgreSQL. D'autres bases de données seront ajoutées prochainement.**

### 3️⃣ CRUD avec l’Entity Manager

#### 🔍 Récupérer toutes les entrées

```ts
const users = await User.getAll();
console.log(users);
```

#### 🔍 Récupérer une entrée par clé primaire

```ts
const user = await User.getByPrimaryKey(1);
console.log(user);
```

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