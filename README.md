# Challenge-platinum

Challenge Platinum Binar Academy

## Kelompok I

1. Yuko Tanjung
2. Muhammad Akbar
3. Muchammad Thohari
4. Habil Tria Sakti

## Installation

Clone this repo

```bash
git clone https://github.com/yukotanjung/challenge-platinum.git
```

Open directory

```bash
cd challenge-platinum
```

Install package

```bash
npm install
```

configure .env

```bash
nano .env
```

configure config database

```bash
nano /config/config.json
```

Create database that has been configured in config.json

```bash
sequelize db:create
```

Migrate database

```bash
sequelize db:migrate
```

## Usage

Make sure nodejs already installed on your computer

```javascript
npm run dev
```

For test use

```javascript
npm test
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
