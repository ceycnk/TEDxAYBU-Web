-- ==============================================================================
-- TEDxAYBU - Katılımcı Türleri ve Ek Alanlar (Aşama 4)
-- ==============================================================================

-- 1. Tabloya yeni alanların eklenmesi
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS participant_type VARCHAR(100) DEFAULT 'aybü öğrencisi';
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS department_or_role VARCHAR(150);

-- 2. Personel ve akademisyenler için öğrenci numarası zorunluluğunu kaldır (nullable yap)
ALTER TABLE public.tickets ALTER COLUMN student_number DROP NOT NULL;

-- 3. Öğrenci numarası sadece girildiğinde benzersiz olsun (NULL olanlar çakışmasın)
DROP INDEX IF EXISTS idx_tickets_unique_student_number;
CREATE UNIQUE INDEX IF NOT EXISTS idx_tickets_unique_student_number 
ON public.tickets (student_number) 
WHERE student_number IS NOT NULL AND TRIM(student_number) <> '';
