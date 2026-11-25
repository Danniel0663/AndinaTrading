INSERT INTO empresas (nombre_empresa, pais, situacion_economica, creado_en)
SELECT simbolo, 'US', 'Demostración', CURRENT_TIMESTAMP
FROM (VALUES ('AAPL'), ('MSFT'), ('NVDA')) AS demo(simbolo)
WHERE NOT EXISTS (SELECT 1 FROM empresas WHERE nombre_empresa = demo.simbolo);

INSERT INTO acciones (nombre_empresa, id_empresa, precio_apertura, precio_alto, precio_bajo, precio_actual, fecha_actualizacion)
SELECT simbolo, id_empresa, precio, precio + 2, precio - 2, precio, CURRENT_TIMESTAMP
FROM (VALUES ('AAPL', 180.00), ('MSFT', 350.00), ('NVDA', 120.00)) AS demo(simbolo, precio)
JOIN empresas ON empresas.nombre_empresa = demo.simbolo
WHERE NOT EXISTS (SELECT 1 FROM acciones WHERE nombre_empresa = demo.simbolo);
