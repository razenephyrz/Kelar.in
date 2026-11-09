import mysql from 'mysql2/promise';

async function test() {
	try {
		const conn = await mysql.createConnection({
			host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
			port: 4000,
			user: '3g8L5XdKpPPZYqZ.root',
			password: 'ImDJgy9QrGwpvnsE',
			database: 'kelarin',
			ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
			connectTimeout: 15000
		});

		const [rows] = await conn.query('SELECT 1 as ok');
		console.log('✅ Berhasil connect:', rows);
		await conn.end();
	} catch (err) {
		console.error('❌ Gagal connect:', err);
	}
}

test();