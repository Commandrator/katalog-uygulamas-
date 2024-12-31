import http from 'http';
import { readFile } from 'fs';
import { DB } from './src/db.js';
class Main extends DB {
    constructor() {
        super();
        this.app = http;
        this.APIPORT = process.env.APIPORT || 5929;  // API portu
        this.APPPORT = process.env.APPPORT || 3000;  // Web portu
    }
    start() {
        let data = this.getDB(); 
        const api = this.app.createServer((req, res) => {
            res.setHeader('Access-Control-Allow-Origin', "http://localhost:".concat(process.env.APPPORT));
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            if (req.url === '/products' && req.method === 'GET') {
                try {
                    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify(data.products, null, 2));
                } catch (error) {
                    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ error: 'Veri çekme hatası', details: error.message }));
                }
            }
            else if (req.url === '/client-config' && req.method === 'GET') {
                try {
                    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify(process.env.CONFIG, null, 2));
                } catch (error) {
                    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ error: 'Veri çekme hatası', details: error.message }));
                }
            }
            else if (req.url === '/series' && req.method === 'GET') {
                try {
                    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify(data.series, null, 2));
                } catch (error) {
                    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ error: 'Veri çekme hatası', details: error.message }));
                }
            }
            else {
                res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: 'Bulunamadı' }));
            }
        });
        api.listen(this.APIPORT, () => {
            console.log(`API: http://localhost:${this.APIPORT} adresinde çalışıyor.`);
        });
        const webs = this.app.createServer((req, res) => {
            if (req.url === '/') {
                readFile('app/pages/catalog/index.html', 'utf8', (err, data) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                        res.end('Sunucu Hatası: ' + err.message);
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end(data);
                });
            }
            else if (req.url === '/index.js') {
                readFile("app/pages/catalog/index.js", 'utf8', (err, data) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Sunucu Hatası: ' + err.message);
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
                    res.end(data);
                });
            }
            else if (req.url === '/edit/index.js') {
                readFile("app/pages/edit-page/index.js", 'utf8', (err, data) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Sunucu Hatası: ' + err.message);
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
                    res.end(data);
                });
            }
            else if (req.url === '/edit') {
                readFile('app/pages/edit-page/index.html', 'utf8', (err, data) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                        res.end('Sunucu Hatası: ' + err.message);
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end(data);
                });
            }
        });
        webs.listen(this.APPPORT, () => {
            console.log(`APP: http://localhost:${this.APPPORT} adresinde çalışıyor.`);
        });
    }
}
new Main().start();
