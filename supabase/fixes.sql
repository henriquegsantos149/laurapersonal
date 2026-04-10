-- =============================================
-- FIXES de segurança e integridade
-- =============================================

-- Fix 1: trigger não deve aceitar role do metadata (escalação de privilégio)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    'student'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Fix 2: workout_logs RLS com validação de assignment (segurança)
DROP POLICY IF EXISTS "Aluno gerencia próprios logs" ON public.workout_logs;

CREATE POLICY "Aluno lê próprios logs" ON public.workout_logs
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Aluno insere próprios logs" ON public.workout_logs
  FOR INSERT WITH CHECK (
    student_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.assignments
      WHERE assignments.id = workout_logs.assignment_id
        AND assignments.student_id = auth.uid()
    )
  );

CREATE POLICY "Aluno atualiza próprios logs" ON public.workout_logs
  FOR UPDATE USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Aluno deleta próprios logs" ON public.workout_logs
  FOR DELETE USING (student_id = auth.uid());

-- Fix 3: constraint UNIQUE para evitar logs duplicados por série/dia
ALTER TABLE public.workout_logs
  DROP CONSTRAINT IF EXISTS uq_log_student_exercise_set_date;

ALTER TABLE public.workout_logs
  ADD CONSTRAINT uq_log_student_exercise_set_date
  UNIQUE (student_id, part_exercise_id, set_number, logged_at);
