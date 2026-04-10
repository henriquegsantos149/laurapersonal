-- =============================================
-- SCHEMA: Laura Personal Trainer App
-- Execute no SQL Editor do Supabase
-- =============================================

-- Perfis de usuário (admin / aluno)
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('admin', 'student')),
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Programas de treino
CREATE TABLE IF NOT EXISTS public.programs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  created_by  UUID REFERENCES public.profiles(id),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Dias de treino dentro de um programa
CREATE TABLE IF NOT EXISTS public.program_days (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id  UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  day_number  INTEGER NOT NULL,
  name        TEXT NOT NULL,
  color       TEXT DEFAULT '#7C3AED',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (program_id, day_number)
);

-- Orientações semanais por programa
CREATE TABLE IF NOT EXISTS public.weekly_guidelines (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id   UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  week_number  INTEGER NOT NULL CHECK (week_number BETWEEN 1 AND 4),
  sets         TEXT NOT NULL,
  intensity    TEXT NOT NULL,
  UNIQUE (program_id, week_number)
);

-- Partes dentro de um dia (aquecimento, principal, desafio)
CREATE TABLE IF NOT EXISTS public.day_parts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id      UUID NOT NULL REFERENCES public.program_days(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  name        TEXT NOT NULL,
  part_type   TEXT NOT NULL CHECK (part_type IN ('warmup', 'main', 'challenge', 'other')),
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Biblioteca de exercícios
CREATE TABLE IF NOT EXISTS public.exercises (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  description   TEXT,
  video_url     TEXT,
  thumbnail_url TEXT,
  muscle_group  TEXT,
  created_by    UUID REFERENCES public.profiles(id),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Exercícios dentro de uma parte
CREATE TABLE IF NOT EXISTS public.part_exercises (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  part_id     UUID NOT NULL REFERENCES public.day_parts(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Atribuições de programa para aluno
CREATE TABLE IF NOT EXISTS public.assignments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  program_id   UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  start_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  current_week INTEGER NOT NULL DEFAULT 1 CHECK (current_week BETWEEN 1 AND 4),
  active       BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (student_id, program_id)
);

-- Logs de treino (registros de carga por aluno)
CREATE TABLE IF NOT EXISTS public.workout_logs (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  part_exercise_id UUID NOT NULL REFERENCES public.part_exercises(id) ON DELETE CASCADE,
  assignment_id    UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  logged_at        TIMESTAMPTZ DEFAULT NOW(),
  set_number       INTEGER NOT NULL,
  reps             INTEGER,
  weight_kg        DECIMAL(6,2),
  notes            TEXT
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_program_days_program ON public.program_days(program_id);
CREATE INDEX IF NOT EXISTS idx_day_parts_day ON public.day_parts(day_id);
CREATE INDEX IF NOT EXISTS idx_part_exercises_part ON public.part_exercises(part_id);
CREATE INDEX IF NOT EXISTS idx_assignments_student ON public.assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_assignments_program ON public.assignments(program_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_student ON public.workout_logs(student_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_exercise ON public.workout_logs(part_exercise_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_guidelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.day_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.part_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;

-- Helper: verificar se usuário é admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- PROFILES
CREATE POLICY "Usuário vê próprio perfil" ON public.profiles
  FOR SELECT USING (id = auth.uid() OR public.is_admin());

CREATE POLICY "Admin gerencia perfis" ON public.profiles
  FOR ALL USING (public.is_admin());

CREATE POLICY "Usuário cria próprio perfil" ON public.profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- PROGRAMS: admin gerencia, aluno lê se tiver atribuição ativa
CREATE POLICY "Admin gerencia programas" ON public.programs
  FOR ALL USING (public.is_admin());

CREATE POLICY "Aluno lê seu programa" ON public.programs
  FOR SELECT USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.assignments
      WHERE assignments.program_id = programs.id
        AND assignments.student_id = auth.uid()
        AND assignments.active = TRUE
    )
  );

-- PROGRAM_DAYS, DAY_PARTS, PART_EXERCISES: seguem o programa pai
CREATE POLICY "Admin gerencia dias" ON public.program_days
  FOR ALL USING (public.is_admin());

CREATE POLICY "Aluno lê dias do seu programa" ON public.program_days
  FOR SELECT USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.assignments
      WHERE assignments.program_id = program_days.program_id
        AND assignments.student_id = auth.uid()
        AND assignments.active = TRUE
    )
  );

CREATE POLICY "Admin gerencia guidelines" ON public.weekly_guidelines
  FOR ALL USING (public.is_admin());

CREATE POLICY "Aluno lê guidelines do seu programa" ON public.weekly_guidelines
  FOR SELECT USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.assignments
      WHERE assignments.program_id = weekly_guidelines.program_id
        AND assignments.student_id = auth.uid()
        AND assignments.active = TRUE
    )
  );

CREATE POLICY "Admin gerencia partes" ON public.day_parts
  FOR ALL USING (public.is_admin());

CREATE POLICY "Aluno lê partes" ON public.day_parts
  FOR SELECT USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1
      FROM public.program_days pd
      JOIN public.assignments a ON a.program_id = pd.program_id
      WHERE pd.id = day_parts.day_id
        AND a.student_id = auth.uid()
        AND a.active = TRUE
    )
  );

-- EXERCISES: admin gerencia, todos autenticados leem
CREATE POLICY "Autenticados veem exercícios" ON public.exercises
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin gerencia exercícios" ON public.exercises
  FOR ALL USING (public.is_admin());

-- PART_EXERCISES
CREATE POLICY "Admin gerencia part_exercises" ON public.part_exercises
  FOR ALL USING (public.is_admin());

CREATE POLICY "Aluno lê part_exercises" ON public.part_exercises
  FOR SELECT USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1
      FROM public.day_parts dp
      JOIN public.program_days pd ON pd.id = dp.day_id
      JOIN public.assignments a ON a.program_id = pd.program_id
      WHERE dp.id = part_exercises.part_id
        AND a.student_id = auth.uid()
        AND a.active = TRUE
    )
  );

-- ASSIGNMENTS
CREATE POLICY "Admin gerencia atribuições" ON public.assignments
  FOR ALL USING (public.is_admin());

CREATE POLICY "Aluno vê própria atribuição" ON public.assignments
  FOR SELECT USING (student_id = auth.uid());

-- WORKOUT_LOGS
CREATE POLICY "Aluno gerencia próprios logs" ON public.workout_logs
  FOR ALL USING (student_id = auth.uid());

CREATE POLICY "Admin lê todos os logs" ON public.workout_logs
  FOR SELECT USING (public.is_admin());

-- =============================================
-- TRIGGER: atualizar updated_at em programs
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER programs_updated_at
  BEFORE UPDATE ON public.programs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- TRIGGER: criar perfil automaticamente após signup
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
