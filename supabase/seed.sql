-- =============================================
-- SEED: Treino HenRe 4.2 — com vídeos
-- Execute APÓS o schema.sql
-- =============================================

-- 1. Programa
INSERT INTO public.programs (id, name, description)
VALUES (
  'aaaaaaaa-0000-0000-0000-000000000001',
  'HenRe 4.2',
  'Programa de hipertrofia com foco em quadríceps, costas, posterior, glúteos e ombros'
)
ON CONFLICT DO NOTHING;

-- 2. Orientações semanais
INSERT INTO public.weekly_guidelines (program_id, week_number, sets, intensity) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001', 1, '3 x 12',        'Cargas moderadas'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 2, '4 x 10',        'Cargas pesadas'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 3, '15 / 12 / 10 / 8', 'Leve / Moderado / Pesado / Muito pesado'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 4, '3 x 25',        'Carga leve')
ON CONFLICT DO NOTHING;

-- 3. Biblioteca de exercícios (com vídeos)
INSERT INTO public.exercises (id, name, muscle_group, description, video_url) VALUES
  ('bbbbbbbb-0001-0000-0000-000000000001', 'Wall Squat',                   'Quadríceps',       'Agachamento na parede pausando 2" em baixo',         'https://youtu.be/XQwXxYseo_A'),
  ('bbbbbbbb-0002-0000-0000-000000000001', 'Sit Up',                       'Abdômen',          'Abdominal clássico',                                  'https://youtu.be/EnqMt24NFAo'),
  ('bbbbbbbb-0003-0000-0000-000000000001', 'Agachamento Livre',            'Quadríceps',       'Na barra livre ou no Smith',                          NULL),
  ('bbbbbbbb-0004-0000-0000-000000000001', 'Leg Press Reto',               'Quadríceps',       'Com pés paralelos',                                   NULL),
  ('bbbbbbbb-0005-0000-0000-000000000001', 'Cadeira Extensora',            'Quadríceps',       NULL,                                                  'https://youtube.com/shorts/ibXLTHE6oD4'),
  ('bbbbbbbb-0006-0000-0000-000000000001', 'Puxada Alta',                  'Costas',           NULL,                                                  'https://youtube.com/shorts/uCXPXJswjcM'),
  ('bbbbbbbb-0007-0000-0000-000000000001', 'Remada Pulley',                'Costas',           'Com corda',                                           'https://youtube.com/shorts/NDAMGOnoZtA'),
  ('bbbbbbbb-0008-0000-0000-000000000001', 'Pull Over',                    'Costas',           'Com corda',                                           'https://youtube.com/shorts/tmF91e8q5s4'),
  ('bbbbbbbb-0009-0000-0000-000000000001', 'Bíceps Pulley',                'Bíceps',           'Com corda',                                           'https://www.youtube.com/shorts/cUXEYaGjB-c'),
  ('bbbbbbbb-0010-0000-0000-000000000001', 'Step Box',                     'Quadríceps',       'Alternado, com carga de 10kg',                        'https://youtu.be/XBQfbwawXrw'),
  ('bbbbbbbb-0011-0000-0000-000000000001', 'Elevação de Quadril na Bola',  'Glúteos',          'Com pés na bola suíça',                               'https://youtube.com/shorts/Si__0EFT6gU'),
  ('bbbbbbbb-0035-0000-0000-000000000001', 'Vai e Volta com Quadril na Bola', 'Glúteos',       'Quadril elevado na bola, movimento de vai e volta',   'https://youtube.com/shorts/o7eBYki77zc'),
  ('bbbbbbbb-0036-0000-0000-000000000001', 'Mistura Quadril na Bola',      'Glúteos',          'Combinação de elevação + vai e volta na bola suíça',  'https://youtube.com/shorts/4mRduOLswzI'),
  ('bbbbbbbb-0012-0000-0000-000000000001', 'Elevação de Quadril na Máquina','Glúteos',         NULL,                                                  'https://youtube.com/shorts/kPYCXEPaFw0'),
  ('bbbbbbbb-0013-0000-0000-000000000001', 'Deadlift',                     'Posterior de coxa','Terra',                                               'https://youtube.com/shorts/HMfaDDdOrSs'),
  ('bbbbbbbb-0014-0000-0000-000000000001', 'Búlgaro',                      'Glúteos',          'Avanço búlgaro',                                      'https://youtu.be/0QYDINqOscw'),
  ('bbbbbbbb-0015-0000-0000-000000000001', 'Cadeira Abdutora',             'Glúteos',          NULL,                                                  'https://youtube.com/shorts/EniOk2QuGeI'),
  ('bbbbbbbb-0016-0000-0000-000000000001', 'Abdutora Inclinada',           'Glúteos',          NULL,                                                  'https://youtube.com/shorts/8JvXy4owhKw'),
  ('bbbbbbbb-0017-0000-0000-000000000001', 'Crucifixo Cross Over',         'Peito',            NULL,                                                  'https://youtube.com/shorts/W9_NBjzK7_I'),
  ('bbbbbbbb-0018-0000-0000-000000000001', 'Supino Máquina',               'Peito',            'Na máquina ou barra',                                 NULL),
  ('bbbbbbbb-0019-0000-0000-000000000001', 'Shoulder Press',               'Ombros',           NULL,                                                  'https://youtube.com/shorts/ITxJsKEtTwg'),
  ('bbbbbbbb-0020-0000-0000-000000000001', 'Abdução de Ombros',            'Ombros',           'Elevação lateral',                                    'https://youtu.be/uTOvnvUe4OE'),
  ('bbbbbbbb-0021-0000-0000-000000000001', 'Elevação Frontal',             'Ombros',           NULL,                                                  'https://youtube.com/shorts/P_vXqwJ92go'),
  ('bbbbbbbb-0022-0000-0000-000000000001', 'Tríceps Unilateral Polia',     'Tríceps',          NULL,                                                  'https://www.youtube.com/shorts/QBTnhqZdQLc'),
  ('bbbbbbbb-0023-0000-0000-000000000001', 'Flexão de Braços',             'Peito',            'No chão ou no Smith',                                 'https://youtube.com/shorts/W9_NBjzK7_I'),
  ('bbbbbbbb-0024-0000-0000-000000000001', 'Abdominal Remador',            'Abdômen',          NULL,                                                  'https://youtu.be/O-haVploPXU'),
  ('bbbbbbbb-0025-0000-0000-000000000001', 'Remada Smith',                 'Costas',           NULL,                                                  'https://youtube.com/shorts/XhjfryT2HAI'),
  ('bbbbbbbb-0026-0000-0000-000000000001', 'Crucifixo Halter',             'Peito',            NULL,                                                  'https://youtube.com/shorts/1jE-QrXJso4'),
  ('bbbbbbbb-0027-0000-0000-000000000001', 'Abdominal Supra',              'Abdômen',          NULL,                                                  'https://youtu.be/qWYBGhOlTTs'),
  ('bbbbbbbb-0028-0000-0000-000000000001', 'Deck Squat',                   'Quadríceps',       NULL,                                                  'https://youtu.be/0OGZBURfv30'),
  ('bbbbbbbb-0029-0000-0000-000000000001', 'Graviton',                     'Costas',           'Barra assistida',                                     'https://youtube.com/shorts/BLJQmIfVTe8'),
  ('bbbbbbbb-0030-0000-0000-000000000001', 'Leg Press 45',                 'Quadríceps',       'Pés em V',                                            NULL),
  ('bbbbbbbb-0031-0000-0000-000000000001', 'Flexão de Quadril',            'Quadríceps',       'Caneleira no solo',                                   'https://youtu.be/_jLKdh2nX3U'),
  ('bbbbbbbb-0032-0000-0000-000000000001', 'Bíceps Halter',                'Bíceps',           NULL,                                                  'https://youtube.com/shorts/rtKY5CQVZ-o'),
  ('bbbbbbbb-0033-0000-0000-000000000001', 'Remada Banco',                 'Costas',           'Remada unilateral no banco',                          'https://youtube.com/shorts/MRTi-Bm45GM'),
  ('bbbbbbbb-0034-0000-0000-000000000001', 'Goblet Squat',                 'Quadríceps',       NULL,                                                  'https://youtube.com/shorts/Gkl33OmuMok')
ON CONFLICT DO NOTHING;

-- =============================================
-- DIA 1: QUADRÍCEPS / COSTAS
-- =============================================
INSERT INTO public.program_days (id, program_id, day_number, name, color) VALUES
  ('cccccccc-0001-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 1, 'QUADRÍCEPS / COSTAS', '#2563EB')
ON CONFLICT DO NOTHING;

INSERT INTO public.day_parts (id, day_id, order_index, name, part_type, notes) VALUES
  ('dddddddd-0101-0000-0000-000000000001', 'cccccccc-0001-0000-0000-000000000001', 1, 'AQUECIMENTO',  'warmup',    'Realizar 3 Rodadas'),
  ('dddddddd-0102-0000-0000-000000000001', 'cccccccc-0001-0000-0000-000000000001', 2, 'COXA',         'main',      NULL),
  ('dddddddd-0103-0000-0000-000000000001', 'cccccccc-0001-0000-0000-000000000001', 3, 'SUPERIORES',   'main',      NULL),
  ('dddddddd-0104-0000-0000-000000000001', 'cccccccc-0001-0000-0000-000000000001', 4, 'DESAFIO',      'challenge', 'Acumular o maior número de rounds em 5 minutos')
ON CONFLICT DO NOTHING;

INSERT INTO public.part_exercises (part_id, exercise_id, order_index, notes) VALUES
  -- Aquecimento
  ('dddddddd-0101-0000-0000-000000000001', 'bbbbbbbb-0001-0000-0000-000000000001', 1, '10 repetições, pausando 2" em baixo'),
  ('dddddddd-0101-0000-0000-000000000001', 'bbbbbbbb-0002-0000-0000-000000000001', 2, '20 repetições'),
  -- Coxa
  ('dddddddd-0102-0000-0000-000000000001', 'bbbbbbbb-0003-0000-0000-000000000001', 1, 'Na barra livre ou no Smith — verificar melhor execução'),
  ('dddddddd-0102-0000-0000-000000000001', 'bbbbbbbb-0004-0000-0000-000000000001', 2, 'Com pés paralelos'),
  ('dddddddd-0102-0000-0000-000000000001', 'bbbbbbbb-0005-0000-0000-000000000001', 3, NULL),
  -- Superiores
  ('dddddddd-0103-0000-0000-000000000001', 'bbbbbbbb-0006-0000-0000-000000000001', 1, NULL),
  ('dddddddd-0103-0000-0000-000000000001', 'bbbbbbbb-0007-0000-0000-000000000001', 2, 'Com corda'),
  ('dddddddd-0103-0000-0000-000000000001', 'bbbbbbbb-0008-0000-0000-000000000001', 3, 'Com corda'),
  ('dddddddd-0103-0000-0000-000000000001', 'bbbbbbbb-0009-0000-0000-000000000001', 4, 'Com corda'),
  -- Desafio
  ('dddddddd-0104-0000-0000-000000000001', 'bbbbbbbb-0010-0000-0000-000000000001', 1, '10/10 com carga de 10kg'),
  ('dddddddd-0104-0000-0000-000000000001', 'bbbbbbbb-0002-0000-0000-000000000001', 2, '10 repetições com carga de 10kg')
ON CONFLICT DO NOTHING;

-- =============================================
-- DIA 2: POSTERIOR / GLÚTEO / OMBRO
-- =============================================
INSERT INTO public.program_days (id, program_id, day_number, name, color) VALUES
  ('cccccccc-0002-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 2, 'POSTERIOR / GLÚTEO / OMBRO', '#D97706')
ON CONFLICT DO NOTHING;

INSERT INTO public.day_parts (id, day_id, order_index, name, part_type, notes) VALUES
  ('dddddddd-0201-0000-0000-000000000001', 'cccccccc-0002-0000-0000-000000000001', 1, 'AQUECIMENTO',      'warmup',    'Realizar 3 Rodadas — 12 repetições cada'),
  ('dddddddd-0202-0000-0000-000000000001', 'cccccccc-0002-0000-0000-000000000001', 2, 'INFERIORES',       'main',      NULL),
  ('dddddddd-0203-0000-0000-000000000001', 'cccccccc-0002-0000-0000-000000000001', 3, 'PEITORAL',         'main',      NULL),
  ('dddddddd-0204-0000-0000-000000000001', 'cccccccc-0002-0000-0000-000000000001', 4, 'OMBROS E TRÍCEPS', 'main',      NULL),
  ('dddddddd-0205-0000-0000-000000000001', 'cccccccc-0002-0000-0000-000000000001', 5, 'DESAFIO',          'challenge', 'Sequência 20-15-12-10 repetições')
ON CONFLICT DO NOTHING;

INSERT INTO public.part_exercises (part_id, exercise_id, order_index, notes) VALUES
  -- Aquecimento (3 movimentos distintos na bola suíça)
  ('dddddddd-0201-0000-0000-000000000001', 'bbbbbbbb-0011-0000-0000-000000000001', 1, '12 Elevação de quadril com pés na bola'),
  ('dddddddd-0201-0000-0000-000000000001', 'bbbbbbbb-0035-0000-0000-000000000001', 2, '12 Vai e Volta com quadril elevado na bola'),
  ('dddddddd-0201-0000-0000-000000000001', 'bbbbbbbb-0036-0000-0000-000000000001', 3, '12 Mistura dos dois movimentos anteriores'),
  -- Inferiores
  ('dddddddd-0202-0000-0000-000000000001', 'bbbbbbbb-0012-0000-0000-000000000001', 1, NULL),
  ('dddddddd-0202-0000-0000-000000000001', 'bbbbbbbb-0013-0000-0000-000000000001', 2, NULL),
  ('dddddddd-0202-0000-0000-000000000001', 'bbbbbbbb-0014-0000-0000-000000000001', 3, NULL),
  ('dddddddd-0202-0000-0000-000000000001', 'bbbbbbbb-0015-0000-0000-000000000001', 4, NULL),
  ('dddddddd-0202-0000-0000-000000000001', 'bbbbbbbb-0016-0000-0000-000000000001', 5, NULL),
  -- Peitoral
  ('dddddddd-0203-0000-0000-000000000001', 'bbbbbbbb-0017-0000-0000-000000000001', 1, NULL),
  ('dddddddd-0203-0000-0000-000000000001', 'bbbbbbbb-0018-0000-0000-000000000001', 2, 'Na máquina ou barra'),
  -- Ombros e Tríceps
  ('dddddddd-0204-0000-0000-000000000001', 'bbbbbbbb-0019-0000-0000-000000000001', 1, NULL),
  ('dddddddd-0204-0000-0000-000000000001', 'bbbbbbbb-0020-0000-0000-000000000001', 2, NULL),
  ('dddddddd-0204-0000-0000-000000000001', 'bbbbbbbb-0021-0000-0000-000000000001', 3, NULL),
  ('dddddddd-0204-0000-0000-000000000001', 'bbbbbbbb-0022-0000-0000-000000000001', 4, NULL),
  -- Desafio
  ('dddddddd-0205-0000-0000-000000000001', 'bbbbbbbb-0023-0000-0000-000000000001', 1, 'No chão ou no Smith'),
  ('dddddddd-0205-0000-0000-000000000001', 'bbbbbbbb-0024-0000-0000-000000000001', 2, NULL)
ON CONFLICT DO NOTHING;

-- =============================================
-- DIA 3: QUADRÍCEPS / COSTAS II
-- =============================================
INSERT INTO public.program_days (id, program_id, day_number, name, color) VALUES
  ('cccccccc-0003-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 3, 'QUADRÍCEPS / COSTAS II', '#059669')
ON CONFLICT DO NOTHING;

INSERT INTO public.day_parts (id, day_id, order_index, name, part_type, notes) VALUES
  ('dddddddd-0301-0000-0000-000000000001', 'cccccccc-0003-0000-0000-000000000001', 1, 'AQUECIMENTO', 'warmup',    'Realizar 3 Rodadas'),
  ('dddddddd-0302-0000-0000-000000000001', 'cccccccc-0003-0000-0000-000000000001', 2, 'COXA',        'main',      NULL),
  ('dddddddd-0303-0000-0000-000000000001', 'cccccccc-0003-0000-0000-000000000001', 3, 'DESAFIO',     'challenge', 'Máximo em 7 minutos sem descanso')
ON CONFLICT DO NOTHING;

INSERT INTO public.part_exercises (part_id, exercise_id, order_index, notes) VALUES
  -- Aquecimento
  ('dddddddd-0301-0000-0000-000000000001', 'bbbbbbbb-0025-0000-0000-000000000001', 1, NULL),
  ('dddddddd-0301-0000-0000-000000000001', 'bbbbbbbb-0026-0000-0000-000000000001', 2, NULL),
  ('dddddddd-0301-0000-0000-000000000001', 'bbbbbbbb-0027-0000-0000-000000000001', 3, '25 repetições'),
  ('dddddddd-0301-0000-0000-000000000001', 'bbbbbbbb-0028-0000-0000-000000000001', 4, '5 repetições'),
  -- Coxa
  ('dddddddd-0302-0000-0000-000000000001', 'bbbbbbbb-0029-0000-0000-000000000001', 1, NULL),
  ('dddddddd-0302-0000-0000-000000000001', 'bbbbbbbb-0030-0000-0000-000000000001', 2, 'Pés em V'),
  ('dddddddd-0302-0000-0000-000000000001', 'bbbbbbbb-0031-0000-0000-000000000001', 3, 'Caneleira no solo'),
  ('dddddddd-0302-0000-0000-000000000001', 'bbbbbbbb-0005-0000-0000-000000000001', 4, NULL),
  ('dddddddd-0302-0000-0000-000000000001', 'bbbbbbbb-0032-0000-0000-000000000001', 5, NULL),
  -- Desafio
  ('dddddddd-0303-0000-0000-000000000001', 'bbbbbbbb-0033-0000-0000-000000000001', 1, '10/10 carga moderada'),
  ('dddddddd-0303-0000-0000-000000000001', 'bbbbbbbb-0034-0000-0000-000000000001', 2, 'Mesma carga')
ON CONFLICT DO NOTHING;
