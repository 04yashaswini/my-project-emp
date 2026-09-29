const r = require('express').Router(), m = require('multer'), fs = require('fs'), path = require('path'), F = 'data/employees.json';
const rd = () => JSON.parse(fs.readFileSync(F));
const up = m({ storage: m.diskStorage({ destination: 'public/uploads', filename: (q, f, c) => c(null, Date.now() + path.extname(f.originalname)) }) });

r.get('/', (q, s) => {
  const all = rd(), { id } = q.query, n = all.length, total = all.reduce((a, e) => a + e.salary, 0);
  s.render('index', { rows: id ? all.filter(e => e.id == id) : [...all].reverse(), id,
    st: { n, total, avg: n ? total / n : 0, max: Math.max(0, ...all.map(e => e.salary)) } });
});
r.post('/add', up.single('photo'), (q, s) => {
  const all = rd();
  all.push({ id: Math.max(100, ...all.map(e => e.id)) + 1, ...q.body, salary: +q.body.salary, photo: q.file?.filename || '' });
  fs.writeFileSync(F, JSON.stringify(all, null, 2));
  s.redirect('/');
});
module.exports = r;
