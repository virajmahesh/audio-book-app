SELECT * FROM librivox_book LIMIT 10;
SELECT * FROM librivox_recording ORDER BY librivox_book_id ASC LIMIT 100;


SELECT
	*
FROM
	librivox_book lb
LEFT JOIN librivox_recording lr ON
	lb.id = lr.librivox_book_id
ORDER BY lb.id, lr.id
LIMIT 200;
