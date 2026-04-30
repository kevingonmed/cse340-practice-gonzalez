import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const NODE_ENV = process.env.NODE_ENV || 'production';
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));


app.get('/', (req, res) => {
    res.render('home', { title: 'Welcome Home' });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About Me' });
});

app.get('/products', (req, res) => {
    res.render('products', { title: 'Our Products' });
});

app.get('/student', (req, res) => {
    const student = {
        name: "Kevin Gonzalez",
        id: "792119701",
        email: "gon22043@byui.edu",
        address: "Shelbourne apartments "
    };

    res.render('student', { title: "Student Info", student });
});


app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
});